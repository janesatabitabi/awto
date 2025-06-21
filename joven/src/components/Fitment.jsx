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

    await getDocs(q); // Optional: setSuggestedProducts if you display suggestions
    setLoading(false);
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
          {['year', 'make', 'model', 'trim', 'drive'].map((key) => (
            <select
              key={key}
              name={key}
              className="fitment-select"
              value={filters[key]}
              onChange={handleChange}
            >
              <option value="">{key.toUpperCase()}</option>
              {options[key + 's'].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          ))}

          <button className="fitment-button" onClick={handleShowResults} disabled={loading}>
            {loading ? 'Loading...' : 'SHOP NOW'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Fitment;
