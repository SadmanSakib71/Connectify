import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { feedApi } from '../../services/api';
import { getFullName } from '../../utils/formatTime';
import { txtImg } from './images';
import './likers-modal.css';

const PAGE_SIZE = 50;

const LikersModal = ({ targetType, targetId, likeCount, isOpen, onClose }) => {
  const [likers, setLikers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetchLikers = useCallback(async (offset, append) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await feedApi.getLikers(targetType, targetId, {
        limit: PAGE_SIZE,
        offset,
      });
      const { likers: fetched, total: fetchedTotal } = response.data;
      setTotal(fetchedTotal);
      setLikers((prev) => (append ? [...prev, ...fetched] : fetched));
    } catch {
      setError('Could not load likes. Please try again.');
      if (!append) {
        setLikers([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [targetType, targetId]);

  useEffect(() => {
    if (!isOpen) return;

    setLikers([]);
    setTotal(0);
    fetchLikers(0, false);
  }, [isOpen, fetchLikers]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasMore = likers.length < total;

  return createPortal(
    <div
      className="_likers_modal_overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="_likers_modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="likers-modal-title"
      >
        <div className="_likers_modal_header">
          <h3 className="_likers_modal_title" id="likers-modal-title">
            {likeCount === 1 ? '1 Like' : `${likeCount} Likes`}
          </h3>
          <button
            type="button"
            className="_likers_modal_close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="_likers_modal_body">
          {loading && (
            <p className="_likers_modal_status">Loading...</p>
          )}

          {!loading && error && (
            <p className="_likers_modal_status">{error}</p>
          )}

          {!loading && !error && likers.length === 0 && (
            <p className="_likers_modal_status">No likes yet.</p>
          )}

          {!loading && !error && likers.map((user) => (
            <a key={user.id} href="/profile" className="_likers_modal_item">
              <img
                src={txtImg}
                alt={getFullName(user)}
                className="_likers_modal_avatar"
              />
              <span className="_likers_modal_name">{getFullName(user)}</span>
            </a>
          ))}

          {!loading && !error && hasMore && (
            <button
              type="button"
              className="_likers_modal_load_more"
              onClick={() => fetchLikers(likers.length, true)}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading...' : `Show more (${total - likers.length} remaining)`}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default LikersModal;
