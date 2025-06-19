import React, { useState, useEffect } from 'react';
import '../styles/Fitment.css';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Fitment = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    year: '',
    make: '',
    model: '',
    trim: '',
    drive: ''
  });

  const [options, setOptions] = useState({
    years: [],
    makes: [],
    models: [],
    trims: [],
    drives: []
  });

  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchYears = async () => {
      const snapshot = await getDocs(collection(db, 'tireProducts'));
      const years = new Set();
      snapshot.forEach(doc => years.add(doc.data().year));
      setOptions(prev => ({ ...prev, years: [...years] }));
    };
    fetchYears();
  }, []);

  useEffect(() => {
    const fetchMakes = async () => {
      if (!filters.year) return;
      const q = query(collection(db, 'tireProducts'), where('year', '==', filters.year));
      const snapshot = await getDocs(q);
      const makes = new Set();
      snapshot.forEach(doc => makes.add(doc.data().make));
      setOptions(prev => ({ ...prev, makes: [...makes], models: [], trims: [], drives: [] }));
    };
    fetchMakes();
  }, [filters.year]);

  useEffect(() => {
    const fetchModels = async () => {
      if (!filters.make) return;
      const q = query(
        collection(db, 'tireProducts'),
        where('year', '==', filters.year),
        where('make', '==', filters.make)
      );
      const snapshot = await getDocs(q);
      const models = new Set();
      snapshot.forEach(doc => models.add(doc.data().model));
      setOptions(prev => ({ ...prev, models: [...models], trims: [], drives: [] }));
    };
    fetchModels();
  }, [filters.make]);

  useEffect(() => {
    const fetchTrims = async () => {
      if (!filters.model) return;
      const q = query(
        collection(db, 'tireProducts'),
        where('year', '==', filters.year),
        where('make', '==', filters.make),
        where('model', '==', filters.model)
      );
      const snapshot = await getDocs(q);
      const trims = new Set();
      snapshot.forEach(doc => trims.add(doc.data().trim));
      setOptions(prev => ({ ...prev, trims: [...trims], drives: [] }));
    };
    fetchTrims();
  }, [filters.model]);

  useEffect(() => {
    const fetchDrives = async () => {
      if (!filters.trim) return;
      const q = query(
        collection(db, 'tireProducts'),
        where('year', '==', filters.year),
        where('make', '==', filters.make),
        where('model', '==', filters.model),
        where('trim', '==', filters.trim)
      );
      const snapshot = await getDocs(q);
      const drives = new Set();
      snapshot.forEach(doc => drives.add(doc.data().drive));
      setOptions(prev => ({ ...prev, drives: [...drives] }));
    };
    fetchDrives();
  }, [filters.trim]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleShowResults = async () => {
    setLoading(true);
    const { year, make, model, trim, drive } = filters;

    const q = query(
      collection(db, 'tireProducts'),
      where('year', '==', year),
      where('make', '==', make),
      where('model', '==', model),
      where('trim', '==', trim),
      where('drive', '==', drive)
    );

    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSuggestedProducts(products);
    setLoading(false);

    // Redirect and pass filters to dashboard
    navigate('/user-dashboard', { state: filters });
  };

  return (
    <section className="fitment-section">
      <video autoPlay muted loop playsInline className="background-video">
        <source src="/videos/fitment-bg.mp4" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      <div className="fitment-overlay">
        <div className="fitment-heading">
          <h2 className="fitment-subtitle">FIND WHAT FITS YOUR RIDE</h2>
          <h1 className="fitment-title">Fitment Video Guides</h1>
          <p className="fitment-description">CAR WHEELS, TIRES, SUSPENSION & MORE</p>
        </div>

        <div className="fitment-form">
          <select name="year" className="fitment-select" value={filters.year} onChange={handleChange}>
            <option value="">YEAR</option>
            {options.years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>

          <select name="make" className="fitment-select" value={filters.make} onChange={handleChange}>
            <option value="">MAKE</option>
            {options.makes.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          <select name="model" className="fitment-select" value={filters.model} onChange={handleChange}>
            <option value="">MODEL</option>
            {options.models.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          <select name="trim" className="fitment-select" value={filters.trim} onChange={handleChange}>
            <option value="">TRIM</option>
            {options.trims.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          <select name="drive" className="fitment-select" value={filters.drive} onChange={handleChange}>
            <option value="">DRIVE</option>
            {options.drives.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>

          <button className="fitment-button" onClick={handleShowResults} disabled={loading}>
            {loading ? 'Loading...' : 'SHOP NOW'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Fitment;
