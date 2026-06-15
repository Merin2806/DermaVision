import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock Database Helper
const getHistoryFromStorage = () => {
  const data = localStorage.getItem('derma_history');
  if (data) return JSON.parse(data);
  
  // Default pre-populated list
  const defaultHistory = [
    {
      id: 'scan-1',
      date: '2026-06-10T14:32:00.000Z',
      condition: 'Acne Vulgaris',
      severity: 'Mild',
      confidence: 91.5,
      imageUrl: null,
      recommendations: [
        'Use a gentle non-comedogenic cleanser twice daily.',
        'Apply topical salicylic acid or benzoyl peroxide targeting active lesions.',
        'Keep skin hydrated with a lightweight, oil-free moisturizer.',
        'Avoid touching or picking active breakouts.'
      ]
    },
    {
      id: 'scan-2',
      date: '2026-06-12T09:15:00.000Z',
      condition: 'Atopic Dermatitis (Eczema)',
      severity: 'Moderate',
      confidence: 88.2,
      imageUrl: null,
      recommendations: [
        'Apply thick emollient creams within 3 minutes after bathing.',
        'Use mild, fragrance-free soaps and laundry detergents.',
        'Identify and avoid environmental triggers (e.g., specific fabrics, excessive heat).',
        'Consult a dermatologist for potential topical corticosteroid treatment.'
      ]
    },
    {
      id: 'scan-3',
      date: '2026-06-14T17:45:00.000Z',
      condition: 'Psoriasis',
      severity: 'Severe',
      confidence: 94.7,
      imageUrl: null,
      recommendations: [
        'Keep the skin well-lubricated with dense ointments or oils.',
        'Consult a dermatologist regarding prescription topical vitamin D analogues.',
        'Discuss systemic therapies or phototherapy options for wider coverage.',
        'Incorporate omega-3 fatty acids and anti-inflammatory foods into your diet.'
      ]
    }
  ];
  localStorage.setItem('derma_history', JSON.stringify(defaultHistory));
  return defaultHistory;
};

// Set up Custom Axios Mock Adapter
api.interceptors.request.use(async (config) => {
  // Override adapter to mock response instead of reaching out to a real backend
  config.adapter = async (config) => {
    // Simulate real-world network latency (1.8s)
    await new Promise((resolve) => setTimeout(resolve, 1800));

    const { url, method, data } = config;
    const parsedData = data ? JSON.parse(data) : {};

    // 1. POST /api/login
    if (url === '/api/login' && method === 'post') {
      const { email, password } = parsedData;
      if (!email || !password) {
        return {
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config,
          data: { error: 'Email and password are required.' },
        };
      }
      const mockUser = {
        name: email.split('@')[0].replace('.', ' '),
        email: email,
        token: 'mock-jwt-token-xyz',
      };
      localStorage.setItem('derma_user', JSON.stringify(mockUser));
      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: mockUser,
      };
    }

    // 2. POST /api/signup
    if (url === '/api/signup' && method === 'post') {
      const { name, email, password } = parsedData;
      if (!name || !email || !password) {
        return {
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config,
          data: { error: 'All fields are required.' },
        };
      }
      const mockUser = { name, email, token: 'mock-jwt-token-xyz' };
      localStorage.setItem('derma_user', JSON.stringify(mockUser));
      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: mockUser,
      };
    }

    // 3. GET /api/history
    if (url === '/api/history' && method === 'get') {
      const history = getHistoryFromStorage();
      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: history,
      };
    }

    // 4. POST /api/analyze
    if (url === '/api/analyze' && method === 'post') {
      const { imageName, imageSize, imageData } = parsedData;
      
      // Select condition based on filename cues if possible, otherwise random
      const nameLower = (imageName || '').toLowerCase();
      let condition = 'Acne Vulgaris';
      let recommendations = [];
      let severity = 'Mild';
      let confidence = (82 + Math.random() * 15).toFixed(1);

      if (nameLower.includes('eczema') || nameLower.includes('dermatitis')) {
        condition = 'Atopic Dermatitis (Eczema)';
        severity = Math.random() > 0.5 ? 'Moderate' : 'Mild';
        recommendations = [
          'Apply thick emollient creams within 3 minutes after bathing.',
          'Use mild, fragrance-free soaps and laundry detergents.',
          'Identify and avoid environmental triggers (e.g., specific fabrics, excessive heat).',
          'Consult a dermatologist for potential topical corticosteroid treatment.'
        ];
      } else if (nameLower.includes('psoriasis')) {
        condition = 'Psoriasis';
        severity = Math.random() > 0.4 ? 'Severe' : 'Moderate';
        recommendations = [
          'Keep the skin well-lubricated with dense ointments or oils.',
          'Consult a dermatologist regarding prescription topical vitamin D analogues.',
          'Discuss systemic therapies or phototherapy options for wider coverage.',
          'Incorporate omega-3 fatty acids and anti-inflammatory foods into your diet.'
        ];
      } else if (nameLower.includes('fungal') || nameLower.includes('ringworm') || nameLower.includes('tinea')) {
        condition = 'Fungal Infection (Tinea)';
        severity = Math.random() > 0.6 ? 'Moderate' : 'Mild';
        recommendations = [
          'Keep the affected area clean and dry at all times.',
          'Apply over-the-counter topical antifungal creams as directed.',
          'Avoid sharing clothing, towels, or personal items.',
          'Wear breathable, loose-fitting cotton clothing.'
        ];
      } else {
        // Default / Acne Vulgaris
        condition = 'Acne Vulgaris';
        severity = Math.random() > 0.7 ? 'Severe' : (Math.random() > 0.35 ? 'Moderate' : 'Mild');
        recommendations = [
          'Use a gentle non-comedogenic cleanser twice daily.',
          'Apply topical salicylic acid or benzoyl peroxide targeting active lesions.',
          'Keep skin hydrated with a lightweight, oil-free moisturizer.',
          'Avoid touching or picking active breakouts.'
        ];
      }

      const newScan = {
        id: `scan-${Date.now()}`,
        date: new Date().toISOString(),
        condition,
        severity,
        confidence: parseFloat(confidence),
        imageUrl: imageData || null,
        recommendations,
      };

      const history = getHistoryFromStorage();
      history.unshift(newScan);
      localStorage.setItem('derma_history', JSON.stringify(history));

      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: newScan,
      };
    }

    // Fallback 404
    return {
      status: 404,
      statusText: 'Not Found',
      headers: {},
      config,
      data: { error: `Endpoint ${url} not found` },
    };
  };

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
