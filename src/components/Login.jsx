const handleForgotPassword = async (e) => {
  e.preventDefault();
  if (!correoInstitucional) {
    setError("Por favor ingrese su correo institucional");
    return;
  }

  try {
    const response = await fetch('https://backend-coral-theta-21.vercel.app/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correoInstitucional }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage(data.message);
      setError(null);
    } else {
      setError(data.error);
      setMessage(null);
    }
  } catch (error) {
    setError("Error al procesar la solicitud");
    setMessage(null);
  }
}; 