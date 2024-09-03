const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Usar variable de entorno para la clave secreta
const cors = require('cors');

// Configuración de CORS para permitir solicitudes desde cualquier origen
app.use(cors({
    origin: '*', // Puedes restringirlo a tu dominio específico para mayor seguridad
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
    const { lineItems } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'https://lauricius.es/success.html', // Asegúrate de que estos URLs sean correctos
            cancel_url: 'https://lauricius.es/cancel.html',
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creando la sesión de Stripe:', error.message);
        res.status(400).send({ error: { message: error.message } });
    }
});

app.listen(4242, '0.0.0.0', () => console.log('Server running on port 4242'));
