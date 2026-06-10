import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import registrationImg from '../assets/images/registration.png';
import registrationDarkImg from '../assets/images/registration1.png';
import logo from '../assets/images/logo.svg';
import google from '../assets/images/google.svg';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitError('');
  };

  const validateClient = () => {
    const fieldErrors = {};

    if (!formData.firstName.trim()) {
      fieldErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      fieldErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      fieldErrors.email = 'Email is required';
    }
    if (!formData.password) {
      fieldErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      fieldErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      fieldErrors.confirmPassword = 'Passwords do not match';
    }
    if (!agreedToTerms) {
      fieldErrors.terms = 'You must agree to the terms and conditions';
    }

    return fieldErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const clientErrors = validateClient();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate('/', { replace: true });
    } catch (err) {
      if (err.errors?.length) {
        const fieldErrors = {};
        err.errors.forEach(({ field, message }) => {
          fieldErrors[field] = message;
        });
        setErrors(fieldErrors);
      } else {
        setSubmitError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="_social_registration_wrapper _layout_main_wrapper">
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
      <div className="_social_registration_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_registration_right">
                <div className="_social_registration_right_image">
                  <img src={registrationImg} alt="Image" />
                </div>
                <div className="_social_registration_right_image_dark">
                  <img src={registrationDarkImg} alt="Image" />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_registration_content">
                <div className="_social_registration_right_logo _mar_b28">
                  <img src={logo} alt="Image" className="_right_logo" />
                </div>
                <p className="_social_registration_content_para _mar_b8">Get Started Now</p>
                <h4 className="_social_registration_content_title _titl4 _mar_b50">Registration</h4>
                <button type="button" className="_social_registration_content_btn _mar_b40" disabled>
                  <img src={google} alt="Image" className="_google_img" />{' '}
                  <span>Register with google</span>
                </button>
                <div className="_social_registration_content_bottom_txt _mar_b40">
                  <span>Or</span>
                </div>
                {submitError && (
                  <div className="alert alert-danger _mar_b14" role="alert">
                    {submitError}
                  </div>
                )}
                <form className="_social_registration_form" onSubmit={handleSubmit} noValidate>
                  <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8" htmlFor="firstName">
                          First Name
                        </label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          className={`form-control _social_registration_input${errors.firstName ? ' is-invalid' : ''}`}
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          autoComplete="given-name"
                        />
                        {errors.firstName && (
                          <div className="invalid-feedback d-block">{errors.firstName}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8" htmlFor="lastName">
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          className={`form-control _social_registration_input${errors.lastName ? ' is-invalid' : ''}`}
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          autoComplete="family-name"
                        />
                        {errors.lastName && (
                          <div className="invalid-feedback d-block">{errors.lastName}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8" htmlFor="email">
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          className={`form-control _social_registration_input${errors.email ? ' is-invalid' : ''}`}
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
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8" htmlFor="password">
                          Password
                        </label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          className={`form-control _social_registration_input${errors.password ? ' is-invalid' : ''}`}
                          value={formData.password}
                          onChange={handleChange}
                          required
                          autoComplete="new-password"
                        />
                        {errors.password && (
                          <div className="invalid-feedback d-block">{errors.password}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8" htmlFor="confirmPassword">
                          Repeat Password
                        </label>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          className={`form-control _social_registration_input${errors.confirmPassword ? ' is-invalid' : ''}`}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          autoComplete="new-password"
                        />
                        {errors.confirmPassword && (
                          <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
                      <div className="form-check _social_registration_form_check">
                        <input
                          className={`form-check-input _social_registration_form_check_input${errors.terms ? ' is-invalid' : ''}`}
                          type="checkbox"
                          id="terms"
                          checked={agreedToTerms}
                          onChange={(e) => {
                            setAgreedToTerms(e.target.checked);
                            setErrors((prev) => ({ ...prev, terms: '' }));
                          }}
                        />
                        <label
                          className="form-check-label _social_registration_form_check_label"
                          htmlFor="terms"
                        >
                          I agree to terms & conditions
                        </label>
                        {errors.terms && (
                          <div className="invalid-feedback d-block">{errors.terms}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                      <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                        <button
                          type="submit"
                          className="_social_registration_form_btn_link _btn1"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Registering...' : 'Register now'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_registration_bottom_txt">
                      <p className="_social_registration_bottom_txt_para">
                        Already have an account? <Link to="/login">Login</Link>
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

export default Register;
