// routes/auth0Webhook.js
import express from 'express';
import { Usuario } from '../model/autenticacion/index.js';

const router = express.Router();

router.post('/auth0/registration', async (req, res) => {
    try {
        if (req.get('x-api-key') !== process.env.APP_WEBHOOK_KEY) {
            return res.status(401).json({ ok: false, error: 'unauthorized' });
        }

        const { auth0_id, email, full_name } = req.body;
        if (!auth0_id) {
            return res.status(400).json({ ok: false, error: 'auth0_id is required' });
        }

        // Minimal upsert: avoid FK/NOT NULL issues during signup
        const existing = await Usuario.findOne({ where: { auth0_id } });
        if (existing) {
            existing.email = email ?? existing.email;
            existing.full_name = full_name ?? existing.full_name;
            await existing.save();
            return res.json({ ok: true, user_id: existing.user_id, created: false });
        }

        const user = await Usuario.create({
            auth0_id,
            email: email ?? null,
            full_name: full_name ?? null,
            // leave phone/cc/user_role_id/status_id for /profile/complete
        });

        return res.json({ ok: true, user_id: user.user_id, created: true });
    } catch (e) {
        console.error('auth0/registration error:', e);
        // TEMP: return the message so we can see the real issue
        return res.status(500).json({ ok: false, error: e.message });
    }
});

export default router;