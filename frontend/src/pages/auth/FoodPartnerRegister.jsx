import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import '../../styles/auth-shared.css';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const FoodPartnerRegister = () => {
  const navigate = useNavigate ();

  // State for all form fields
  const [form, setForm] = useState ({
    businessName: '',
    contactName: '',
    phone: '',
    email: '',
    password: '',
    address: '',
  });

  // Generic change handler
  const handleChange = e => {
    const {name, value} = e.target;
    setForm (prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault ();

    axios
      .post (
        '/api/auth/food-partner/register',
        {
          name: form.businessName,
          contactName: form.contactName,
          phone: form.phone,
          email: form.email,
          password: form.password,
          address: form.address,
        },
        {withCredentials: true}
      )
      .then (response => {
        console.log (response.data);
        navigate ('/create-food'); // Redirect to create food page after successful registration
      })
      .catch (error => {
        console.error ('There was an error registering!', error);
      });
  };

  return (
    <div className="auth-page-wrapper">
      <div
        className="auth-card"
        role="region"
        aria-labelledby="partner-register-title"
      >
        <header>
          <h1 id="partner-register-title" className="auth-title">
            Partner sign up
          </h1>
          <p className="auth-subtitle">Grow your business with our platform.</p>
        </header>
        <nav className="auth-alt-action" style={{marginTop: '-4px'}}>
          <strong style={{fontWeight: 600}}>Switch:</strong>
          {' '}
          <Link to="/user/register">User</Link>
          {' '}
          •
          {' '}
          <Link to="/food-partner/register">Food partner</Link>
        </nav>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="businessName">Business Name</label>
            <input
              id="businessName"
              name="businessName"
              placeholder="Tasty Bites"
              autoComplete="organization"
              value={form.businessName}
              onChange={handleChange}
            />
          </div>
          <div className="two-col">
            <div className="field-group">
              <label htmlFor="contactName">Contact Name</label>
              <input
                id="contactName"
                name="contactName"
                placeholder="Jane Doe"
                autoComplete="name"
                value={form.contactName}
                onChange={handleChange}
              />
            </div>
            <div className="field-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                placeholder="+1 555 123 4567"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="business@example.com"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div className="field-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              placeholder="123 Market Street"
              autoComplete="street-address"
              value={form.address}
              onChange={handleChange}
            />
            <p className="small-note">
              Full address helps customers find you faster.
            </p>
          </div>
          <button className="auth-submit" type="submit">
            Create Partner Account
          </button>
        </form>
        <div className="auth-alt-action">
          Already a partner? <Link to="/food-partner/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;
