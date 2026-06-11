import { useCallback, useEffect, useState } from "react";
import {
  postImg,
  reactImg1,
  reactImg2,
  reactImg3,
  reactImg4,
  reactImg5,
  commentImg,
  txtImg,
} from "./images";
import { feedApi } from "../../services/api";
import { formatTimeAgo, getFullName } from "../../utils/formatTime";
import LikersTrigger from "./LikersTrigger";

const timelineMenuItems = [
  { label: "Save Post", icon: "bookmark", action: null },
  { label: "Turn On Notification", icon: "notify", action: null },
  { label: "Hide", icon: "hide", action: null },
  { label: "Edit Post", icon: "edit", action: null },
  { label: "Delete Post", icon: "delete", action: "delete" },
];

const LikeAvatars = ({ targetType, targetId, likedBy, likeCount }) => {
  const displayUsers = likedBy.slice(0, 5);
  const avatarImages = [reactImg1, reactImg2, reactImg3, reactImg4, reactImg5];

  return (
    <LikersTrigger
      targetType={targetType}
      targetId={targetId}
      likeCount={likeCount}
      className="_feed_inner_timeline_total_reacts_image"
    >
      {displayUsers.map((user, index) => (
        <img
          key={user.id}
          src={avatarImages[index] || reactImg1}
          alt={getFullName(user)}
          className={
            index === 0 ? "_react_img1" : "_react_img _rect_img_mbl_none"
          }
        />
      ))}
      <p className="_feed_inner_timeline_total_reacts_para">
        {likeCount > displayUsers.length ? `${likeCount}+` : likeCount}
      </p>
    </LikersTrigger>
  );
};

const LikeReactionBadge = ({ targetType, targetId, likeCount }) => (
  <LikersTrigger
    targetType={targetType}
    targetId={targetId}
    likeCount={likeCount}
    className="_total_reactions"
  >
    <div className="_total_react">
      <span className="_reaction_like">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
      </span>
    </div>
    <span className="_total">{likeCount}</span>
  </LikersTrigger>
);

const CommentBox = ({ textareaId, value, onChange, onSubmit, submitting }) => (
  <div className="_feed_inner_timeline_cooment_area">
    <div className="_feed_inner_comment_box">
      <form
        className="_feed_inner_comment_box_form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.();
        }}
      >
        <div className="_feed_inner_comment_box_content">
          <div className="_feed_inner_comment_box_content_image">
            <img src={commentImg} alt="" className="_comment_img" />
          </div>
          <div className="_feed_inner_comment_box_content_txt">
            <textarea
              className="form-control _comment_textarea"
              placeholder="Write a comment"
              id={textareaId}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        </div>
        <div className="_feed_inner_comment_box_icon">
          <button
            type="submit"
            className="_feed_inner_comment_box_icon_btn"
            disabled={submitting}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 16 16"
            >
              <path
                fill="#000"
                fillOpacity=".46"
                fillRule="evenodd"
                d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
);

const ReplyItem = ({ reply, onToggleLike }) => (
  <div className="_comment_main _mar_t8">
    <div className="_comment_image">
      <a href="/profile" className="_comment_image_link">
        <img
          src={txtImg}
          alt={getFullName(reply.author)}
          className="_comment_img1"
        />
      </a>
    </div>
    <div className="_comment_area">
      <div className="_comment_details">
        <div className="_comment_details_top">
          <div className="_comment_name">
            <a href="/profile">
              <h4 className="_comment_name_title">
                {getFullName(reply.author)}
              </h4>
            </a>
          </div>
        </div>
        <div className="_comment_status">
          <p className="_comment_status_text">
            <span>{reply.text}</span>
          </p>
        </div>
        <LikeReactionBadge
          targetType="reply"
          targetId={reply.id}
          likeCount={reply.likeCount}
        />
        <div className="_comment_reply">
          <div className="_comment_reply_num">
            <ul className="_comment_reply_list">
              <li>
                <button
                  type="button"
                  onClick={() => onToggleLike("reply", reply.id)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  <span>{reply.isLiked ? "Unlike" : "Like"}</span>
                </button>
              </li>
              <li>
                <span className="_time_link">
                  {formatTimeAgo(reply.createdAt)}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CommentItem = ({ comment, onToggleLike, onReplyAdded }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);

  useEffect(() => {
    setReplies(comment.replies || []);
  }, [comment.replies]);

  const handleAddReply = async () => {
    if (!replyText.trim() || submittingReply) return;

    setSubmittingReply(true);
    try {
      const response = await feedApi.addReply(comment.id, replyText.trim());
      setReplies((prev) => [...prev, response.data.reply]);
      onReplyAdded?.();
      setReplyText("");
      setShowReplyBox(false);
    } catch {
      // keep UI stable on failure
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleReplyLike = async (targetType, targetId) => {
    try {
      const response = await feedApi.toggleLike(targetType, targetId);
      setReplies((prev) =>
        prev.map((reply) =>
          reply.id === targetId
            ? {
                ...reply,
                isLiked: response.data.liked,
                likeCount: response.data.likeCount,
                likedBy: response.data.likedBy,
              }
            : reply,
        ),
      );
    } catch {
      // keep UI stable on failure
    }
  };

  return (
    <div className="_comment_main">
      <div className="_comment_image">
        <a href="/profile" className="_comment_image_link">
          <img
            src={txtImg}
            alt={getFullName(comment.author)}
            className="_comment_img1"
          />
        </a>
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          <div className="_comment_details_top">
            <div className="_comment_name">
              <a href="/profile">
                <h4 className="_comment_name_title">
                  {getFullName(comment.author)}
                </h4>
              </a>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text">
              <span>{comment.text}</span>
            </p>
          </div>
          <LikeReactionBadge
            targetType="comment"
            targetId={comment.id}
            likeCount={comment.likeCount}
          />
          <div className="_comment_reply">
            <div className="_comment_reply_num">
              <ul className="_comment_reply_list">
                <li>
                  <button
                    type="button"
                    onClick={() => onToggleLike("comment", comment.id)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    <span>{comment.isLiked ? "Unlike" : "Like"}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setShowReplyBox((prev) => !prev)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    <span>Reply</span>
                  </button>
                </li>
                <li>
                  <span className="_time_link">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {showReplyBox && (
          <CommentBox
            textareaId={`floatingTextarea-reply-${comment.id}`}
            value={replyText}
            onChange={setReplyText}
            onSubmit={handleAddReply}
            submitting={submittingReply}
          />
        )}
        {replies.map((reply) => (
          <ReplyItem
            key={reply.id}
            reply={reply}
            onToggleLike={handleReplyLike}
          />
        ))}
      </div>
    </div>
  );
};

const FeedPost = ({ post, currentUser, onPostUpdated, onPostDeleted }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likeState, setLikeState] = useState({
    isLiked: post.isLiked,
    likeCount: post.likeCount,
    likedBy: post.likedBy,
  });

  const isOwner = currentUser?.id === post.author.id;
  const showDropdown = isOwner;

  useEffect(() => {
    setLikeState({
      isLiked: post.isLiked,
      likeCount: post.likeCount,
      likedBy: post.likedBy,
    });
  }, [post.isLiked, post.likeCount, post.likedBy]);

  const loadComments = useCallback(async () => {
    setCommentsLoading(true);
    try {
      const response = await feedApi.getComments(post.id);
      setComments(response.data.comments);
    } catch {
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }, [post.id]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleTogglePostLike = async () => {
    try {
      const response = await feedApi.toggleLike("post", post.id);
      const updated = {
        ...post,
        isLiked: response.data.liked,
        likeCount: response.data.likeCount,
        likedBy: response.data.likedBy,
      };
      setLikeState({
        isLiked: response.data.liked,
        likeCount: response.data.likeCount,
        likedBy: response.data.likedBy,
      });
      onPostUpdated?.(updated);
    } catch {
      // keep UI stable on failure
    }
  };

  const handleToggleCommentLike = async (targetType, targetId) => {
    try {
      const response = await feedApi.toggleLike(targetType, targetId);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === targetId
            ? {
                ...comment,
                isLiked: response.data.liked,
                likeCount: response.data.likeCount,
                likedBy: response.data.likedBy,
              }
            : comment,
        ),
      );
    } catch {
      // keep UI stable on failure
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      const response = await feedApi.addComment(post.id, commentText.trim());
      setComments((prev) => [...prev, response.data.comment]);
      onPostUpdated?.({
        ...post,
        commentCount: (post.commentCount || 0) + 1,
      });
      setCommentText("");
    } catch {
      // keep UI stable on failure
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await feedApi.deletePost(post.id);
      onPostDeleted?.(post.id);
    } catch {
      // keep UI stable on failure
    }
  };

  const handleMenuClick = (action) => {
    if (action === "delete") {
      handleDeletePost();
    }
    setDropdownOpen(false);
  };

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <img
                src={postImg}
                alt={getFullName(post.author)}
                className="_post_img"
              />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">
                {getFullName(post.author)}
              </h4>
              <p className="_feed_inner_timeline_post_box_para">
                {formatTimeAgo(post.createdAt)} .{" "}
                <a href="#0">
                  {post.visibility === "private" ? "Private" : "Public"}
                </a>
              </p>
            </div>
          </div>
          {showDropdown && (
            <div className="_feed_inner_timeline_post_box_dropdown">
              <div className="_feed_timeline_post_dropdown">
                <button
                  type="button"
                  className="_feed_timeline_post_dropdown_link"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="4"
                    height="17"
                    fill="none"
                    viewBox="0 0 4 17"
                  >
                    <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                    <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                    <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                  </svg>
                </button>
              </div>
              <div
                className={`_feed_timeline_dropdown${showDropdown ? " _timeline_dropdown" : ""}${dropdownOpen ? " show" : ""}`}
              >
                <ul className="_feed_timeline_dropdown_list">
                  {timelineMenuItems.map((item) => (
                    <li
                      key={item.label}
                      className="_feed_timeline_dropdown_item"
                    >
                      <button
                        type="button"
                        className="_feed_timeline_dropdown_link"
                        onClick={() => handleMenuClick(item.action)}
                        style={{
                          background: "none",
                          border: "none",
                          width: "100%",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        <h4 className="_feed_inner_timeline_post_title">{post.text}</h4>
        {post.imageUrl && (
          <div className="_feed_inner_timeline_image">
            <img src={post.imageUrl} alt="" className="_time_img" />
          </div>
        )}
      </div>

      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <LikeAvatars
          targetType="post"
          targetId={post.id}
          likedBy={likeState.likedBy}
          likeCount={likeState.likeCount}
        />
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <span>{post.commentCount || comments.length}</span> Comment
            {(post.commentCount || comments.length) === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="_feed_inner_timeline_reaction">
        <button
          type="button"
          className={`_feed_inner_timeline_reaction_emoji _feed_reaction${likeState.isLiked ? " _feed_reaction_active" : ""}`}
          onClick={handleTogglePostLike}
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                fill="none"
                viewBox="0 0 19 19"
              >
                <path
                  fill="#FFCC4D"
                  d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"
                />
                <path
                  fill="#664500"
                  d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"
                />
                <path
                  fill="#fff"
                  d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"
                />
                <path
                  fill="#664500"
                  d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"
                />
              </svg>
              {likeState.isLiked ? "Liked" : "Like"}
            </span>
          </span>
        </button>
        <button
          type="button"
          className="_feed_inner_timeline_reaction_comment _feed_reaction"
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg
                className="_reaction_svg"
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                fill="none"
                viewBox="0 0 21 21"
              >
                <path
                  stroke="#000"
                  d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"
                />
                <path
                  stroke="#000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.938 9.313h7.125M10.5 14.063h3.563"
                />
              </svg>
              Comment
            </span>
          </span>
        </button>
        <button
          type="button"
          className="_feed_inner_timeline_reaction_share _feed_reaction"
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg
                className="_reaction_svg"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="21"
                fill="none"
                viewBox="0 0 24 21"
              >
                <path
                  stroke="#000"
                  strokeLinejoin="round"
                  d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"
                />
              </svg>
              Share
            </span>
          </span>
        </button>
      </div>

      <CommentBox
        textareaId={`floatingTextarea-post-${post.id}`}
        value={commentText}
        onChange={setCommentText}
        onSubmit={handleAddComment}
        submitting={submittingComment}
      />

      <div className="_timline_comment_main">
        {commentsLoading && (
          <p style={{ fontSize: "13px", color: "#666", padding: "0 24px" }}>
            Loading comments...
          </p>
        )}
        {!commentsLoading && comments.length === 0 && (
          <p style={{ fontSize: "13px", color: "#666", padding: "0 24px" }}>
            No comments yet.
          </p>
        )}
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onToggleLike={handleToggleCommentLike}
            onReplyAdded={loadComments}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedPost;
