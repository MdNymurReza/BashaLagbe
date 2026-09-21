'use client';

// ============================================================
// FEATURE: Seeking Room / Flatmate
// Component: SeekingDashboardTab
// Displays user's seeking posts, incoming responses (with Accept/Reject),
// and sent responses inside the student dashboard.
// ============================================================

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import type { SeekingPost, SeekingResponse } from '../types';
import { fmt, propertyTypeLabel } from '../utils';
import { acceptSeekResponse, rejectSeekResponse } from '../actions';

interface SeekingDashboardTabProps {
  mySeeking: SeekingPost[];
  seekRespRecv: SeekingResponse[];
  seekRespSent: SeekingResponse[];
  onRefresh?: () => void;
}

export default function SeekingDashboardTab({
  mySeeking,
  seekRespRecv,
  seekRespSent,
  onRefresh
}: SeekingDashboardTabProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleAccept = async (responseId: number) => {
    setLoadingId(responseId);
    try {
      const res = await acceptSeekResponse(responseId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Response accepted! The responder has been notified.');
        if (onRefresh) onRefresh();
      }
    } catch {
      toast.error('Failed to accept response');
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (responseId: number) => {
    setLoadingId(responseId);
    try {
      const res = await rejectSeekResponse(responseId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Response rejected.');
        if (onRefresh) onRefresh();
      }
    } catch {
      toast.error('Failed to reject response');
    } finally {
      setLoadingId(null);
    }
  };

  const renderBadge = (status: string) => {
    if (status === 'accepted') return <span className="badge badge-success">Accepted</span>;
    if (status === 'rejected') return <span className="badge badge-danger">Rejected</span>;
    return <span className="badge badge-amber">Pending</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. My Seeking Posts */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: 'var(--navy)' }}>My "Looking For" Requests</h3>
          <Link href="/seeking" className="btn btn-sm btn-outline">+ New Request</Link>
        </div>
        {(!mySeeking || mySeeking.length === 0) ? (
          <p style={{ color: 'var(--ink-muted)', textAlign: 'center', padding: '24px 0' }}>
            No requests posted yet. <Link href="/seeking">Post one on the seeking board</Link>.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Zone</th>
                  <th>Type</th>
                  <th>Budget</th>
                  <th>Move-in</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mySeeking.map(s => (
                  <tr key={s.post_id || s.id}>
                    <td>{s.zone || s.zone_id}</td>
                    <td>{propertyTypeLabel(s.property_type)}</td>
                    <td>{fmt(s.budget_min)} – {fmt(s.budget_max)}</td>
                    <td>{s.move_in_date || 'Flexible'}</td>
                    <td>{renderBadge(s.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. Responses Received on User's Posts */}
      <div className="card">
        <h3 style={{ marginTop: 0, color: 'var(--navy)' }}>Responses Received</h3>
        {(!seekRespRecv || seekRespRecv.length === 0) ? (
          <p style={{ color: 'var(--ink-muted)', textAlign: 'center', padding: '12px 0' }}>
            No responses received yet.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {seekRespRecv.map(r => (
                  <tr key={r.response_id}>
                    <td><strong>{r.responder_name || 'Anonymous'}</strong></td>
                    <td style={{ maxWidth: 220, wordBreak: 'break-word' }}>{r.message}</td>
                    <td>{renderBadge(r.status)}</td>
                    <td>
                      {r.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            className="btn btn-success btn-sm" 
                            onClick={() => handleAccept(r.response_id)} 
                            disabled={loadingId === r.response_id}
                          >
                            Accept
                          </button>
                          <button 
                            className="btn btn-danger btn-sm" 
                            onClick={() => handleReject(r.response_id)} 
                            disabled={loadingId === r.response_id}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Responses Sent by User to Other Posts */}
      <div className="card">
        <h3 style={{ marginTop: 0, color: 'var(--navy)' }}>Responses Sent</h3>
        {(!seekRespSent || seekRespSent.length === 0) ? (
          <p style={{ color: 'var(--ink-muted)', textAlign: 'center', padding: '12px 0' }}>
            You haven't responded to any posts yet.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Post Details</th>
                  <th>Post Owner</th>
                  <th>Your Message</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {seekRespSent.map(r => (
                  <tr key={r.response_id}>
                    <td>{r.requirements ? r.requirements.substring(0, 40) + '…' : 'Seeking Request'}</td>
                    <td>{r.owner_name || '—'}</td>
                    <td style={{ maxWidth: 220, wordBreak: 'break-word' }}>{r.message}</td>
                    <td>{renderBadge(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
