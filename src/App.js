import React, { useState, useEffect } from 'react';
import TacheForm from './TacheForm';
import { supabase } from './supabaseClient';

function App() {
	
	
  const [recherche, setRecherche] = useState("");
  const [tri, setTri] = useState("date");
  const [taches, setTaches] = useState([]);

  
  const chargerTaches = async () => {
	 const { data, error } = await supabase
		.from('taches')
		.select('*')
		.order('created_at', { ascending: false });

	  if (error) {
		console.error('Erreur chargement tâches:', error);
	  } else {
		setTaches(data);
	  }
	};
  // Calcul date rappel (exclut samedi/dimanche)
  const getRappelDate = (dateLimiteStr, joursAvant) => {
    const rappel = new Date(`${dateLimiteStr}T08:00`);
    let jours = parseInt(joursAvant);
    while (jours > 0) {
      rappel.setDate(rappel.getDate() - 1);
      const jour = rappel.getDay();
      if (jour !== 0 && jour !== 6) {
        jours--;
      }
    }
    return rappel;
  };

  // Ajouter une nouvelle tâche localement
	const handleNouvelleTache = async (tache) => {
	  const tacheAvecRappel = {
		...tache,
		statut: tache.statut || "À faire",
		alerteEnvoyee: false,
	  };

	  if (tache.rappelAvant && tache.date) {
		const dateRappel = getRappelDate(tache.date, tache.rappelAvant);
		tacheAvecRappel.rappelDate = dateRappel.toISOString();
	  }

	  const { data: tachesData, error } = await supabase
		.from('taches')
		.select('*')
		.order('created_at', { ascending: false });

		if (error) {
		  console.error('Erreur chargement tâches:', error);
		} else {
		  setTaches(tachesData);
		}

	};


  // Supprimer une tâche localement
  const supprimerTache = async (id) => {
  const { error } = await supabase.from('taches').delete().eq('id', id);
  if (error) {
    console.error("Erreur suppression tâche :", error);
  } else {
    await chargerTaches();
  }
};


  // Modifier statut localement
  const modifierStatut = async (id, statut) => {
  const { error } = await supabase.from('taches').update({ statut }).eq('id', id);
  if (error) {
    console.error("Erreur mise à jour statut :", error);
  } else {
    await chargerTaches();
  }
};

  // Notifications rappel local + chargement tâches au démarrage
useEffect(() => {
  // Charger les tâches au démarrage
  chargerTaches();

  // Setup intervalle notification rappel
  const interval = setInterval(() => {
    const maintenant = new Date();

    setTaches(prev => {
      return prev.map(t => {
        if (!t.alerteEnvoyee && t.rappelDate) {
          const dateTache = new Date(t.rappelDate);
          if (Math.abs(dateTache - maintenant) < 60000) {
            if (Notification.permission === "granted") {
              new Notification("🔔 Rappel de tâche", { body: t.titre });
            } else {
              alert(`🔔 Rappel : ${t.titre}`);
            }
            return { ...t, alerteEnvoyee: true };
          }
        }
        return t;
      });
    });
  }, 30000);

  // Nettoyage intervalle à la destruction du composant
  return () => clearInterval(interval);
}, []);


  // Filtrer et trier tâches
  const tachesFiltrees = taches
    .filter(t => t.titre.toLowerCase().includes(recherche.toLowerCase()))
    .sort((a, b) => {
      if (tri === "date") return new Date(a.date) - new Date(b.date);
      if (tri === "priorite") {
        const ordre = { Basse: 1, Normale: 2, Haute: 3 };
        return ordre[b.priorite] - ordre[a.priorite];
      }
      if (tri === "importance") {
        const ordre = { Faible: 1, Moyenne: 2, Forte: 3 };
        return ordre[b.importance] - ordre[a.importance];
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-secondary text-gray-800 p-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Mes tâches quotidiennes</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <input
          type="text"
          placeholder="🔎 Rechercher..."
          onChange={e => setRecherche(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full max-w-sm"
        />
        <select
          onChange={e => setTri(e.target.value)}
          defaultValue="date"
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="date">📅 Date</option>
          <option value="priorite">⚡ Priorité</option>
          <option value="importance">📊 Importance</option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <TacheForm onSubmit={handleNouvelleTache} />
        </div>

        <div className="md:w-2/3">
          <h2 className="text-xl font-semibold mb-4">📋 Vue Kanban :</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {["À faire", "En cours", "Terminé"].map(statut => (
              <div key={statut} className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-bold text-primary mb-3">{statut}</h3>
                {tachesFiltrees
                  .filter(t => t.statut === statut)
                  .map(t => {
                    const cardColor = t.urgence ? 'bg-red-100' : 'bg-green-100';
                    return (
                      <div key={t.id} className={`border border-gray-200 rounded p-3 mb-4 shadow-sm ${cardColor}`}>
                        <div className="font-semibold text-gray-900">{t.titre}</div>
                        <div className="text-sm text-gray-600">{t.date} à {t.heure}</div>
                        <div className="text-xs text-gray-500 mb-1">
                          Priorité : {t.priorite} | Urgence : {t.urgence ? 'Oui' : 'Non'} | Importance : {t.importance}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          🔁 {t.recurrence} | 📌 Rappel : {t.rappelAvant ? `${t.rappelAvant} jour(s) avant à 08h00` : 'Aucun'}
                        </div>
                        <select
                          value={t.statut}
                          onChange={(e) => modifierStatut(t.id, e.target.value)}
                          className="w-full mb-2 border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="À faire">📌 À faire</option>
                          <option value="En cours">🔄 En cours</option>
                          <option value="Terminé">✅ Terminé</option>
                        </select>
                        <button
                          onClick={() => supprimerTache(t.id)}
                          className="bg-red-500 hover:bg-red-600 text-white rounded px-3 py-1 text-sm w-full"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
