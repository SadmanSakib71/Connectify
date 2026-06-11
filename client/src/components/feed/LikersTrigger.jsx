import { useState } from 'react';
import LikersModal from './LikersModal';
import './likers-modal.css';

const LikersTrigger = ({ targetType, targetId, likeCount, className, children }) => {
  const [open, setOpen] = useState(false);

  if (!likeCount) return null;

  return (
    <>
      <button
        type="button"
        className={`_likers_trigger${className ? ` ${className}` : ''}`}
        onClick={() => setOpen(true)}
        aria-label={`View ${likeCount} like${likeCount === 1 ? '' : 's'}`}
      >
        {children}
      </button>
      <LikersModal
        targetType={targetType}
        targetId={targetId}
        likeCount={likeCount}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default LikersTrigger;
