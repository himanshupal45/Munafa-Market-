import React, { useState, useEffect } from "react";
import { Trophy, Search } from "lucide-react";
import { resultsAPI, gamesAPI } from "../../services/api";
import "./Results.css";

export default function Results() {
  const [results, setResults] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGame, setFilterGame] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [rRes, gRes] = await Promise.all([
          resultsAPI.getAll({ limit: 200 }),
          gamesAPI.getAll(),
        ]);
        if (rRes.success) setResults(rRes.results.filter((r) => r.isPublished));
        if (gRes.success) setGames(gRes.games);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = results.filter((r) => {
    const matchGame = filterGame ? r.gameName === filterGame : true;
    const matchSearch = search
      ? r.gameName?.toLowerCase().includes(search.toLowerCase()) ||
        r.result?.includes(search)
      : true;
    return matchGame && matchSearch;
  });

  // Group by date
  const grouped = filtered.reduce((acc, r) => {
    const date = new Date(r.date || r.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(r);
    return acc;
  }, {});

  const dateKeys = Object.keys(grouped);
  const paginatedKeys = dateKeys.slice(0, page * PER_PAGE);

  return (
    <div className="results-page">
      {/* Header */}
      <div className="results-header">
        <div className="results-header-icon">
          <Trophy size={18} color="#fff" />
        </div>
        <h1 className="results-title">Results</h1>
      </div>

      {/* Controls */}
      <div className="results-controls">
        <div className="results-search-wrap">
          <span className="results-search-icon">
            <Search size={14} />
          </span>
          <input
            className="results-search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Game ya number search karo..."
          />
        </div>
        <select
          className={`results-filter ${filterGame ? "active" : ""}`}
          value={filterGame}
          onChange={(e) => {
            setFilterGame(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Games</option>
          {games.map((g) => (
            <option key={g._id} value={g.name}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="results-loading">
          <div className="spinner" />
          <p>Loading...</p>
        </div>
      ) : dateKeys.length === 0 ? (
        <div className="results-empty">
          <Trophy size={44} />
          <p>Koi result nahi mila</p>
        </div>
      ) : (
        <>
          {paginatedKeys.map((date) => (
            <div className="results-date-group" key={date}>
              <div className="results-date-divider">
                <div className="results-date-line" />
                <span className="results-date-label">{date}</span>
                <div className="results-date-line" />
              </div>
              <div className="results-list">
                {grouped[date].map((r, idx) => (
                  <div
                    className="results-card"
                    key={r._id}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="results-card-left">
                      <div className="results-card-abbr">
                        {r.gameName?.slice(0, 2)}
                      </div>
                      <span className="results-card-name">{r.gameName}</span>
                    </div>
                    <div className="results-card-badge">
                      <span className="results-card-num">{r.result}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {paginatedKeys.length < dateKeys.length && (
            <button
              className="results-load-more"
              onClick={() => setPage((p) => p + 1)}
            >
              और लोड करें
            </button>
          )}
        </>
      )}
    </div>
  );
}
