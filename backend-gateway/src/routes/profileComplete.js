import express from 'express';
import { Usuario } from '../model/autenticacion/index.js';

const router = express.Router();

router.post('/profile/complete', async (req, res) => {
    try {
        const { userId, fullName, phone, cc, user_role_id } = req.body;

        const user = await Usuario.findOne({ where: { auth0_id: userId } });
        if (!user) return res.status(404).json({ ok: false, error: 'user_not_found' });

        user.full_name     = fullName ?? user.full_name;
        user.phone         = phone ?? user.phone;
        user.cc            = cc ?? user.cc;
        user.user_role_id  = user_role_id ?? user.user_role_id;

        // Your requested status code:
        user.status_id     = 'est_user_act';
        if ('needs_profile' in user) user.needs_profile = false; // optional column

        await user.save();
        res.json({ ok: true });
    } catch (e) {
        console.error('/profile/complete error', e);
        res.status(500).json({ ok: false });
    }
});

export default router;