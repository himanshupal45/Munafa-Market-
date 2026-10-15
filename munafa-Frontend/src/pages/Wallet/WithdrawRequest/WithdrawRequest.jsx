import React, { useState, useEffect, useCallback } from "react";
import {
  Home as HomeIcon,
  ArrowDownRight,
  Eye,
  Check,
  X,
  RefreshCw,
} from "lucide-react";
import { apiCall } from "../../../context/AuthContext";
import "./WithdrawRequest.css";

// Uploaded QR image ka link banane ke liye (API_BASE se /api hata ke)
const FILE_ORIGIN = (
  import.meta.env.DEV
    ? import.meta.env.VITE_DEV_API_URL || "http://localhost:5000/api"
    : import.meta.env.VITE_API_URL || "https://astroconnect.co.in/api"
).replace(/\/api\/?$/, "");

const METHOD_NAMES = {
  phonepe: "PhonePe",
  gpay: "Google Pay",
  paytm: "Paytm",
  qr: "QR Code",
};

export default function WithdrawPointsRequest() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [tableSearch, setTableSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null); // detail modal
  const limit = 20;

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (appliedSearch.trim()) params.append("search", appliedSearch.trim());

      const res = await apiCall(`/wallet/withdrawals?${params.toString()}`);

      if (res?.success) {
        const mapped = (res.requests || []).map((req) => ({
          id: req._id,
          userName: req.user?.name || "N/A",
          userMobile: req.user?.mobile || "N/A",
          points: req.amount,
          requestNo: `REQ-${String(req._id).slice(-8).toUpperCase()}`,
          date: new Date(req.createdAt).toLocaleString("en-IN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          status: req.status,
          method: METHOD_NAMES[req.method] || req.method || "-",
          methodKey: req.method || "",
          accountDetails: req.accountDetails || "",
          qrImage: req.qrImage ? `${FILE_ORIGIN}${req.qrImage}` : "",
          note: req.note || "",
        }));
        setData(mapped);
        setTotal(res.total || 0);
      } else {
        setError(res?.message || "Failed to load requests");
      }
    } catch (err) {
      console.error("Load withdraw requests error:", err);
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }, [page, appliedSearch]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleMainSearch = () => {
    setPage(1);
    setAppliedSearch(searchKeyword);
  };

  const handleView = (id) => {
    const req = data.find((r) => r.id === id);
    if (req) setSelected(req);
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this withdrawal request?")) return;
    try {
      const res = await apiCall(`/wallet/withdrawals/${id}`, "PUT", {
        status: "Approved",
      });
      if (res?.success) {
        alert("✅ Withdrawal approved");
        setSelected(null);
        loadRequests();
      } else {
        alert(res?.message || "Approve fail hua");
      }
    } catch (err) {
      alert(err.message || "Network error");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reject reason (optional):");
    if (reason === null) return;
    if (!window.confirm("Reject this withdrawal request?")) return;
    try {
      const res = await apiCall(`/wallet/withdrawals/${id}`, "PUT", {
        status: "Rejected",
        note: reason || "",
      });
      if (res?.success) {
        alert("❌ Withdrawal rejected — amount user ko refund kar diya");
        setSelected(null);
        loadRequests();
      } else {
        alert(res?.message || "Reject fail hua");
      }
    } catch (err) {
      alert(err.message || "Network error");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
      case "Accepted":
        return "wr-status-accepted";
      case "Rejected":
        return "wr-status-rejected";
      case "Pending":
        return "wr-status-pending";
      default:
        return "";
    }
  };

  const detailOf = (row) =>
    row.methodKey === "qr" ? "QR Image" : row.accountDetails || "-";

  const handleCopy = () => {
    if (data.length === 0) return alert("No data to copy");
    const text = data
      .map((r) =>
        [
          r.userName,
          r.userMobile,
          r.points,
          r.method,
          detailOf(r),
          r.requestNo,
          r.date,
          r.status,
        ].join("\t"),
      )
      .join("\n");
    navigator.clipboard.writeText(text).then(() => alert("✅ Copied!"));
  };

  const handleCSV = () => {
    if (data.length === 0) return alert("No data to export");
    const headers = [
      "#",
      "User Name",
      "User Mobile",
      "Points",
      "Method",
      "Account",
      "Request No.",
      "Date",
      "Status",
    ];
    const rows = data
      .map((r, i) =>
        [
          i + 1,
          r.userName,
          r.userMobile,
          r.points,
          r.method,
          detailOf(r),
          r.requestNo,
          r.date,
          r.status,
        ]
          .map((v) => `"${v}"`)
          .join(","),
      )
      .join("\n");
    const blob = new Blob([`${headers.join(",")}\n${rows}`], {
      type: "text/csv",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `withdraw_points_${Date.now()}.csv`;
    link.click();
  };

  const tableHtml = () => {
    let html =
      "<table><thead><tr><th>#</th><th>User Name</th><th>User Mobile</th><th>Points</th><th>Method</th><th>Account</th><th>Request No.</th><th>Date</th><th>Status</th></tr></thead><tbody>";
    data.forEach((r, i) => {
      html += `<tr><td>${i + 1}</td><td>${r.userName}</td><td>${r.userMobile}</td><td>${r.points}</td><td>${r.method}</td><td>${detailOf(r)}</td><td>${r.requestNo}</td><td>${r.date}</td><td>${r.status}</td></tr>`;
    });
    return html + "</tbody></table>";
  };

  const handleExcel = () => {
    if (data.length === 0) return alert("No data to export");
    const blob = new Blob([tableHtml()], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `withdraw_points_${Date.now()}.xls`;
    link.click();
  };

  const handlePrint = () => {
    if (data.length === 0) return alert("No data to print");
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Withdraw Points Request</title>
      <style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #ddd;padding:8px}th{background:#f5f5f5}</style></head><body>
      <h2>Withdraw Points Request</h2>${tableHtml()}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => {
      w.print();
      w.close();
    }, 250);
  };

  const filteredData = data.filter((row) => {
    if (!tableSearch.trim()) return true;
    const q = tableSearch.toLowerCase();
    return (
      row.userName?.toLowerCase().includes(q) ||
      row.userMobile?.toLowerCase().includes(q) ||
      row.requestNo?.toLowerCase().includes(q) ||
      row.method?.toLowerCase().includes(q) ||
      row.status?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const pageStart = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pageNumbers = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, i) => pageStart + i,
  );

  return (
    <div className="wr-page">
      <div className="wr-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="wr-breadcrumb-sep">/</span>
        <span>Withdraw Request</span>
      </div>

      <div className="wr-page-title-wrapper">
        <ArrowDownRight size={26} className="wr-page-title-icon" />
        <h1 className="wr-page-title">Withdraw Points Request</h1>
      </div>

      <div className="wr-main-search">
        <p className="wr-search-hint">Search with Mobile number, Amount</p>
        <div className="wr-search-row">
          <input
            type="text"
            className="wr-search-large-input"
            placeholder="Enter Keyword"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleMainSearch()}
          />
          <button
            className="wr-search-large-btn"
            onClick={handleMainSearch}
            type="button"
          >
            Search
          </button>
        </div>
      </div>

      <div className="wr-card">
        <div className="wr-card-top">
          <button className="wr-withdraw-btn" type="button">
            Withdraw Points
          </button>
          <button
            className="wr-toolbar-btn wr-refresh-btn"
            onClick={loadRequests}
            type="button"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        <div className="wr-toolbar">
          <div className="wr-toolbar-buttons">
            <button
              className="wr-toolbar-btn"
              onClick={handleCopy}
              type="button"
            >
              Copy
            </button>
            <button
              className="wr-toolbar-btn"
              onClick={handleCSV}
              type="button"
            >
              CSV
            </button>
            <button
              className="wr-toolbar-btn"
              onClick={handleExcel}
              type="button"
            >
              Excel
            </button>
            <button
              className="wr-toolbar-btn"
              onClick={handlePrint}
              type="button"
            >
              PDF
            </button>
            <button
              className="wr-toolbar-btn"
              onClick={handlePrint}
              type="button"
            >
              Print
            </button>
          </div>
          <div className="wr-toolbar-search">
            <label>Search:</label>
            <input
              type="text"
              className="wr-search-input"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="wr-table-wrapper">
          <table className="wr-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User Name</th>
                <th>User Mobile</th>
                <th>Points</th>
                <th>Method</th>
                <th>Request No.</th>
                <th>Date</th>
                <th>Status</th>
                <th>View</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="wr-table-empty">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="10" className="wr-table-empty wr-table-error">
                    ⚠️ {error}
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="10" className="wr-table-empty">
                    No data available in table
                  </td>
                </tr>
              ) : (
                filteredData.map((row, i) => (
                  <tr key={row.id}>
                    <td>{(page - 1) * limit + i + 1}</td>
                    <td className="wr-user-name">{row.userName}</td>
                    <td>{row.userMobile}</td>
                    <td>{row.points}</td>
                    <td>{row.method}</td>
                    <td className="wr-request-no">{row.requestNo}</td>
                    <td className="wr-date">{row.date}</td>
                    <td>
                      <span
                        className={`wr-status-badge ${getStatusClass(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="wr-view-btn"
                        onClick={() => handleView(row.id)}
                        title="View"
                        type="button"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                    <td>
                      {row.status === "Pending" ? (
                        <div className="wr-action-buttons">
                          <button
                            className="wr-action-btn wr-approve-btn"
                            onClick={() => handleApprove(row.id)}
                            title="Approve"
                            type="button"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            className="wr-action-btn wr-reject-btn"
                            onClick={() => handleReject(row.id)}
                            title="Reject"
                            type="button"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="wr-action-taken-btn"
                          onClick={() => handleView(row.id)}
                          type="button"
                        >
                          Action Taken
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="wr-pagination">
          <button
            className="wr-page-btn"
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ‹
          </button>
          {pageNumbers.map((n) => (
            <button
              key={n}
              className={`wr-page-btn ${page === n ? "active" : ""}`}
              type="button"
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          <button
            className="wr-page-btn"
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            ›
          </button>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="wr-modal-overlay" onClick={() => setSelected(null)}>
          <div className="wr-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="wr-modal-title">Request Details</h3>

            <p className="wr-modal-row">
              <b>User:</b> {selected.userName}
            </p>
            <p className="wr-modal-row">
              <b>Mobile:</b> {selected.userMobile}
            </p>
            <p className="wr-modal-row">
              <b>Points:</b> ₹{selected.points}
            </p>
            <p className="wr-modal-row">
              <b>Method:</b> {selected.method}
            </p>

            {selected.methodKey === "qr" ? (
              selected.qrImage ? (
                <div className="wr-modal-row">
                  <b>QR Code:</b>
                  <div className="wr-modal-qr-wrap">
                    <a
                      href={selected.qrImage}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={selected.qrImage}
                        alt="QR"
                        className="wr-modal-qr-img"
                      />
                    </a>
                  </div>
                </div>
              ) : (
                <p className="wr-modal-row">
                  <b>QR Code:</b> N/A
                </p>
              )
            ) : (
              <p className="wr-modal-row">
                <b>Account:</b> {selected.accountDetails || "N/A"}
              </p>
            )}

            <p className="wr-modal-row">
              <b>Request No:</b> {selected.requestNo}
            </p>
            <p className="wr-modal-row">
              <b>Date:</b> {selected.date}
            </p>
            <p className="wr-modal-row">
              <b>Status:</b> {selected.status}
            </p>

            {selected.note && (
              <p className="wr-modal-row">
                <b>Note:</b> {selected.note}
              </p>
            )}

            <div className="wr-modal-actions">
              {selected.status === "Pending" && (
                <>
                  <button
                    type="button"
                    className="wr-modal-btn wr-modal-btn-approve"
                    onClick={() => handleApprove(selected.id)}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="wr-modal-btn wr-modal-btn-reject"
                    onClick={() => handleReject(selected.id)}
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                type="button"
                className="wr-modal-btn wr-modal-btn-close"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}