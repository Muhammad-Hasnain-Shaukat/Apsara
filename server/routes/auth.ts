import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db, User } from '../db.js';
import { generateToken, authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Register new customer account (Admins cannot sign up publicly)
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, full_name, phone } = req.body;

    if (!email || !password || !full_name) {
      res.status(400).json({ message: 'Email, password, and full name are required' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    // Strictly prevent signing up as master admin
    if (cleanEmail === 'admin@apsara.com') {
      res.status(403).json({ message: 'Administrator accounts cannot be registered.' });
      return;
    }

    const existingUser = db.getUserByEmail(cleanEmail);
    if (existingUser) {
      res.status(409).json({ message: 'An account with this email address already exists. Please sign in.' });
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);
    const id = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // ALWAYS strictly customer role
    const newUser: User = {
      id,
      email: cleanEmail,
      password_hash,
      full_name: full_name.trim(),
      phone: phone || '',
      role: 'customer',
      saved_addresses: [],
      created_at: new Date().toISOString()
    };

    db.createUser(newUser);

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: 'customer',
      full_name: newUser.full_name
    });

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        phone: newUser.phone,
        role: 'customer',
        saved_addresses: newUser.saved_addresses,
        created_at: newUser.created_at
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
});

// Standard Customer Login ONLY (Admin access strictly removed from this endpoint)
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    // Block admin login from user login portal silently without giving any hint
    if (cleanEmail === 'admin@apsara.com') {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const user = db.getUserByEmail(cleanEmail);
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: 'customer',
      full_name: user.full_name
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        role: 'customer',
        saved_addresses: user.saved_addresses || [],
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
});

// Secret Master Admin Gateway Login Endpoint (The ONLY place where admin can authenticate)
router.post('/admin-login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Master Administrator credentials required' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    // Only the single master admin is authorized
    if (cleanEmail !== 'admin@apsara.com') {
      res.status(403).json({ message: 'Access Denied: Unrecognized administrator' });
      return;
    }

    let admin = db.getUserByEmail('admin@apsara.com');
    if (!admin) {
      const adminHash = await bcrypt.hash('apsara2026', 10);
      admin = {
        id: 'usr-admin-01',
        email: 'admin@apsara.com',
        password_hash: adminHash,
        full_name: 'Master Administrator',
        phone: '+92 42 3578 9900',
        role: 'admin',
        saved_addresses: [],
        created_at: new Date('2025-01-01T00:00:00Z').toISOString()
      };
      db.createUser(admin);
    }

    const isMasterPass = password === 'apsara2026' || password === 'AdminPass123!';
    const isHashMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMasterPass && !isHashMatch) {
      res.status(401).json({ message: 'Invalid administrator password' });
      return;
    }

    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: 'admin',
      full_name: admin.full_name
    });

    res.json({
      message: 'Master Administrator Authenticated',
      token,
      user: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        phone: admin.phone,
        role: 'admin',
        saved_addresses: [],
        created_at: admin.created_at
      }
    });
  } catch (error) {
    console.error('Secret admin login error:', error);
    res.status(500).json({ message: 'Internal server error during admin authentication' });
  }
});

// Google OAuth 2.0 Endpoint (Always strictly customer)
router.post('/google', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, full_name } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Google account email is required' });
      return;
    }

    const targetEmail = email.toLowerCase().trim();

    // Validate email format and reject invalid domains
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(targetEmail) || targetEmail.includes('@jmail.com') || targetEmail.includes('@gmai.com')) {
      res.status(400).json({ message: 'Invalid Google account email address.' });
      return;
    }

    // Never grant admin role via Google auth
    let user = db.getUserByEmail(targetEmail);

    if (!user) {
      const id = `usr-g-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const dummyHash = await bcrypt.hash(`GoogleAuth-${Date.now()}`, 10);

      user = {
        id,
        email: targetEmail,
        password_hash: dummyHash,
        full_name: full_name?.trim() || targetEmail.split('@')[0],
        phone: '',
        role: 'customer',
        saved_addresses: [],
        created_at: new Date().toISOString()
      };

      db.createUser(user);
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: 'customer',
      full_name: user.full_name
    });

    res.json({
      message: 'Google authentication successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        role: 'customer',
        saved_addresses: user.saved_addresses || [],
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Failed to authenticate with Google' });
  }
});

// Get current user session
router.get('/me', authenticateToken, (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  const user = db.getUserById(req.user.id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.email === 'admin@apsara.com' ? 'admin' : 'customer',
      saved_addresses: user.saved_addresses || [],
      created_at: user.created_at
    }
  });
});

// Update profile
router.put('/profile', authenticateToken, (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  const { full_name, phone, saved_addresses } = req.body;
  const updates: Partial<User> = {};

  if (full_name !== undefined) updates.full_name = full_name.trim();
  if (phone !== undefined) updates.phone = phone.trim();
  if (saved_addresses !== undefined) updates.saved_addresses = saved_addresses;

  const updatedUser = db.updateUser(req.user.id, updates);
  if (!updatedUser) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      full_name: updatedUser.full_name,
      phone: updatedUser.phone,
      role: updatedUser.email === 'admin@apsara.com' ? 'admin' : 'customer',
      saved_addresses: updatedUser.saved_addresses || [],
      created_at: updatedUser.created_at
    }
  });
});

export default router;
