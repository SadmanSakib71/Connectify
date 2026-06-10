import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/css/bootstrap.min.css';
import '../assets/css/common.css';
import '../assets/css/main.css';
import '../assets/css/responsive.css';
import '../assets/js/bootstrap.bundle.min.js';

import shape1 from '../assets/images/shape1.svg';
import darkShape from '../assets/images/dark_shape.svg';
import shape2 from '../assets/images/shape2.svg';
import darkShape1 from '../assets/images/dark_shape1.svg';
import shape3 from '../assets/images/shape3.svg';
import darkShape2 from '../assets/images/dark_shape2.svg';
import loginImg from '../assets/images/login.png';
import logo from '../assets/images/logo.svg';
import google from '../assets/images/google.svg';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (err) {
      if (err.errors?.length) {
        const fieldErrors = {};
        err.errors.forEach(({ field, message }) => {
          fieldErrors[field] = message;
        });
        setErrors(fieldErrors);
      } else {
        setSubmitError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="_social_login_wrapper _layout_main_wrapper">
      <div className="_shape_one">
        <img src={shape1} alt="" className="_shape_img" />
        <img src={darkShape} alt="" className="_dark_shape" />
      </div>
      <div className="_shape_two">
        <img src={shape2} alt="" className="_shape_img" />
        <img src={darkShape1} alt="" className="_dark_shape _dark_shape_opacity" />
      </div>
      <div className="_shape_three">
        <img src={shape3} alt="" className="_shape_img" />
        <img src={darkShape2} alt="" className="_dark_shape _dark_shape_opacity" />
      </div>
      <div className="_social_login_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_login_left">
                <div className="_social_login_left_image">
                  <img src={loginImg} alt="Image" className="_left_img" />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_login_content">
                <div className="_social_login_left_logo _mar_b28">
                  <img src={logo} alt="Image" className="_left_logo" />
                </div>
                <p className="_social_login_content_para _mar_b8">Welcome back</p>
                <h4 className="_social_login_content_title _titl4 _mar_b50">Login to your account</h4>
                <button type="button" className="_social_login_content_btn _mar_b40" disabled>
                  <img src={google} alt="Image" className="_google_img" />{' '}
                  <span>Or sign-in with google</span>
                </button>
                <div className="_social_login_content_bottom_txt _mar_b40">
                  <span>Or</span>
                </div>
                {submitError && (
                  <div className="alert alert-danger _mar_b14" role="alert">
                    {submitError}
                  </div>
                )}
                <form className="_social_login_form" onSubmit={handleSubmit} noValidate>
                  <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_login_form_input _mar_b14">
                        <label className="_social_login_label _mar_b8" htmlFor="email">
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          className={`form-control _social_login_input${errors.email ? ' is-invalid' : ''}`}
                          value={formData.email}
                          onChange={handleChange}
                          required
                          autoComplete="email"
                        />
                        {errors.email && (
                          <div className="invalid-feedback d-block">{errors.email}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_login_form_input _mar_b14">
                        <label className="_social_login_label _mar_b8" htmlFor="password">
                          Password
                        </label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          className={`form-control _social_login_input${errors.password ? ' is-invalid' : ''}`}
                          value={formData.password}
                          onChange={handleChange}
                          required
                          autoComplete="current-password"
                        />
                        {errors.password && (
                          <div className="invalid-feedback d-block">{errors.password}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                      <div className="form-check _social_login_form_check">
                        <input
                          className="form-check-input _social_login_form_check_input"
                          type="checkbox"
                          id="rememberMe"
                        />
                        <label
                          className="form-check-label _social_login_form_check_label"
                          htmlFor="rememberMe"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                      <div className="_social_login_form_btn _mar_t40 _mar_b60">
                        <button
                          type="submit"
                          className="_social_login_form_btn_link _btn1"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Logging in...' : 'Login now'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_login_bottom_txt">
                      <p className="_social_login_bottom_txt_para">
                        Dont have an account? <Link to="/register">Create New Account</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
