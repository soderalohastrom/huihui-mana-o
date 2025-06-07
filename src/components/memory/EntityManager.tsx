import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function EntityManager() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  
  const entities = useQuery(api.entities.getUserEntitiesPublic);
  const createEntity = useMutation(api.entities.createEntityPublic);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && type && description) {
      await createEntity({ name, type, description });
      setName("");
      setType("");
      setDescription("");
      setShowForm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Memory Graph Entities
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Cancel" : "Add Entity"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Name (e.g., George, Paris, Project X)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Type (e.g., person, place, project)"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={2}
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add to Memory Graph
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {!entities ? (
          <p className="text-gray-500">Loading entities...</p>
        ) : entities.length === 0 ? (
          <p className="text-gray-500">No entities in your memory graph yet.</p>
        ) : (
          entities.map((entity) => (
            <div key={entity._id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{entity.name}</h3>
                  <p className="text-sm text-gray-600">{entity.type} • {entity.description}</p>
                </div>
                <div className="text-xs text-gray-500">
                  Seen {entity.frequency}x
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}