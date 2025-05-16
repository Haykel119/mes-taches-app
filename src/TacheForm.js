import React, { useState } from 'react';

function TacheForm({ onSubmit }) {
  const [tache, setTache] = useState({
    titre: '',
    description: '',
    date: '',
    heure: '',
    priorite: 'Normale',
    urgence: false,
    importance: 'Moyenne',
    rappelAvant: '',
    recurrence: 'Jamais',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTache({
      ...tache,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tache.titre || !tache.date) {
      alert('Merci de renseigner au minimum le titre et la date limite.');
      return;
    }
    onSubmit(tache);
    setTache({
      titre: '',
      description: '',
      date: '',
      heure: '',
      priorite: 'Normale',
      urgence: false,
      importance: 'Moyenne',
      rappelAvant: '',
      recurrence: 'Jamais',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mb-6 max-w-2xl">
      <h2 className="text-2xl font-semibold text-primary mb-4">Ajouter une tâche</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium" htmlFor="titre">Titre :</label>
        <input
          id="titre"
          type="text"
          name="titre"
          value={tache.titre}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Titre de la tâche"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium" htmlFor="description">Description :</label>
        <textarea
          id="description"
          name="description"
          value={tache.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Description optionnelle"
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium" htmlFor="date">Date limite :</label>
          <input
            id="date"
            type="date"
            name="date"
            value={tache.date}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium" htmlFor="heure">Heure limite :</label>
          <input
            id="heure"
            type="time"
            name="heure"
            value={tache.heure}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium" htmlFor="priorite">Priorité :</label>
        <select
          id="priorite"
          name="priorite"
          value={tache.priorite}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="Basse">Basse</option>
          <option value="Normale">Normale</option>
          <option value="Haute">Haute</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="urgence"
            checked={tache.urgence}
            onChange={handleChange}
            className="mr-2"
          />
          Urgent
        </label>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium" htmlFor="importance">Importance :</label>
        <select
          id="importance"
          name="importance"
          value={tache.importance}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="Faible">Faible</option>
          <option value="Moyenne">Moyenne</option>
          <option value="Forte">Forte</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium" htmlFor="rappelAvant">Rappel automatique :</label>
        <select
          id="rappelAvant"
          name="rappelAvant"
          value={tache.rappelAvant}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Aucun</option>
          <option value="1">1 jour avant</option>
          <option value="2">2 jours avant</option>
          <option value="3">3 jours avant</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium" htmlFor="recurrence">Récurrence :</label>
        <select
          id="recurrence"
          name="recurrence"
          value={tache.recurrence}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="Jamais">Jamais</option>
          <option value="Quotidienne">Quotidienne</option>
          <option value="Hebdomadaire">Hebdomadaire</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
      >
        ➕ Ajouter la tâche
      </button>
    </form>
  );
}

export default TacheForm;
