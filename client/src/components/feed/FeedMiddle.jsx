import {
  cardPpl1,
  cardPpl2,
  cardPpl3,
  cardPpl4,
  miniPic,
  mobileStoryImg,
  mobileStoryImg1,
  mobileStoryImg2,
  txtImg,
} from './images';
import { timelinePosts } from './data';
import FeedPost from './FeedPost';

const PostActionButtons = ({ mobile = false }) => {
  const buttons = [
    { label: 'Photo', mobile: false },
    { label: 'Video', mobile: false },
    { label: 'Event', mobile: false },
    { label: 'Article', mobile: false },
  ];

  if (mobile) {
    return (
      <div className="_feed_inner_text_area_item">
        {buttons.map((btn) => (
          <div key={btn.label} className={`_feed_inner_text_area_bottom_${btn.label.toLowerCase()} _feed_common`}>
            <button type="button" className="_feed_inner_text_area_bottom_photo_link">
              <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img" />
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="_feed_inner_text_area_item">
      <div className="_feed_inner_text_area_bottom_photo _feed_common">
        <button type="button" className="_feed_inner_text_area_bottom_photo_link">
          <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
              <path fill="#666" d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z" />
            </svg>
          </span>
          Photo
        </button>
      </div>
      <div className="_feed_inner_text_area_bottom_video _feed_common">
        <button type="button" className="_feed_inner_text_area_bottom_photo_link">
          <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">Video</span>
        </button>
      </div>
      <div className="_feed_inner_text_area_bottom_event _feed_common">
        <button type="button" className="_feed_inner_text_area_bottom_photo_link">
          <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">Event</span>
        </button>
      </div>
      <div className="_feed_inner_text_area_bottom_article _feed_common">
        <button type="button" className="_feed_inner_text_area_bottom_photo_link">
          <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">Article</span>
        </button>
      </div>
    </div>
  );
};

const mobileStories = [
  { type: 'own', image: mobileStoryImg, label: 'Your Story' },
  { type: 'active', image: mobileStoryImg1, label: 'Ryan...' },
  { type: 'inactive', image: mobileStoryImg2, label: 'Ryan...' },
  { type: 'active', image: mobileStoryImg1, label: 'Ryan...' },
  { type: 'inactive', image: mobileStoryImg2, label: 'Ryan...' },
  { type: 'active', image: mobileStoryImg1, label: 'Ryan...' },
  { type: 'own-plain', image: mobileStoryImg, label: 'Ryan...' },
  { type: 'active', image: mobileStoryImg1, label: 'Ryan...' },
];

const FeedMiddle = () => {
  return (
    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
      <div className="_layout_middle_wrap">
        <div className="_layout_middle_inner">
          <div className="_feed_inner_ppl_card _mar_b16">
            <div className="_feed_inner_story_arrow">
              <button type="button" className="_feed_inner_story_arrow_btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" fill="none" viewBox="0 0 9 8">
                  <path fill="#fff" d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z" />
                </svg>
              </button>
            </div>
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
                <div className="_feed_inner_profile_story _b_radious6">
                  <div className="_feed_inner_profile_story_image">
                    <img src={cardPpl1} alt="Your Story" className="_profile_story_img" />
                    <div className="_feed_inner_story_txt">
                      <div className="_feed_inner_story_btn">
                        <button type="button" className="_feed_inner_story_btn_link">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                            <path stroke="#fff" strokeLinecap="round" d="M.5 4.884h9M4.884 9.5v-9" />
                          </svg>
                        </button>
                      </div>
                      <p className="_feed_inner_story_para">Your Story</p>
                    </div>
                  </div>
                </div>
              </div>
              {[
                { img: cardPpl2, extraClass: ' col' },
                { img: cardPpl3, extraClass: ' col _custom_mobile_none' },
                { img: cardPpl4, extraClass: ' col _custom_none' },
              ].map(({ img, extraClass }) => (
                <div
                  key={img}
                  className={`col-xl-3 col-lg-3 col-md-4 col-sm-4${extraClass}`}
                >
                  <div className="_feed_inner_public_story _b_radious6">
                    <div className="_feed_inner_public_story_image">
                      <img src={img} alt="Ryan Roslansky" className="_public_story_img" />
                      <div className="_feed_inner_pulic_story_txt">
                        <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
                      </div>
                      <div className="_feed_inner_public_mini">
                        <img src={miniPic} alt="" className="_public_mini_img" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="_feed_inner_ppl_card_mobile _mar_b16">
            <div className="_feed_inner_ppl_card_area">
              <ul className="_feed_inner_ppl_card_area_list">
                {mobileStories.map((story, index) => (
                  <li key={index} className="_feed_inner_ppl_card_area_item">
                    <a href="#0" className="_feed_inner_ppl_card_area_link">
                      <div className={
                        story.type === 'own' ? '_feed_inner_ppl_card_area_story' :
                        story.type === 'active' ? '_feed_inner_ppl_card_area_story_active' :
                        story.type === 'inactive' ? '_feed_inner_ppl_card_area_story_inactive' :
                        '_feed_inner_ppl_card_area_story'
                      }>
                        <img src={story.image} alt={story.label} className={story.type === 'own' || story.type === 'own-plain' ? '_card_story_img' : '_card_story_img1'} />
                        {story.type === 'own' && (
                          <div className="_feed_inner_ppl_btn">
                            <button type="button" className="_feed_inner_ppl_btn_link">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
                                <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M6 2.5v7M2.5 6h7" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                      <p className={story.type === 'own' ? '_feed_inner_ppl_card_area_link_txt' : '_feed_inner_ppl_card_area_txt'}>{story.label}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
            <div className="_feed_inner_text_area_box">
              <div className="_feed_inner_text_area_box_image">
                <img src={txtImg} alt="" className="_txt_img" />
              </div>
              <div className="form-floating _feed_inner_text_area_box_form">
                <textarea className="form-control _textarea" placeholder="Leave a comment here" id="floatingTextarea" />
                <label className="_feed_textarea_label" htmlFor="floatingTextarea">
                  Write something ...
                </label>
              </div>
            </div>

            <div className="_feed_inner_text_area_bottom">
              <PostActionButtons />
              <div className="_feed_inner_text_area_btn">
                <button type="button" className="_feed_inner_text_area_btn_link">
                  <svg className="_mar_img" xmlns="http://www.w3.org/2000/svg" width="14" height="13" fill="none" viewBox="0 0 14 13">
                    <path fill="#fff" fillRule="evenodd" d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z" clipRule="evenodd" />
                  </svg>
                  <span>Post</span>
                </button>
              </div>
            </div>

            <div className="_feed_inner_text_area_bottom_mobile">
              <div className="_feed_inner_text_mobile">
                <PostActionButtons mobile />
                <div className="_feed_inner_text_area_btn">
                  <button type="button" className="_feed_inner_text_area_btn_link">
                    <svg className="_mar_img" xmlns="http://www.w3.org/2000/svg" width="14" height="13" fill="none" viewBox="0 0 14 13">
                      <path fill="#fff" fillRule="evenodd" d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z" clipRule="evenodd" />
                    </svg>
                    <span>Post</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {timelinePosts.map((post) => (
            <FeedPost key={post.id} id={post.id} showDropdown={post.showDropdown} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedMiddle;
