import { useNavigate } from 'react-router-dom'
import { Container, Box, TextField, Button, FormLabel, CircularProgress, Typography } from '@mui/material'
import LoadingErrorWraper from '../Components/LoadingErrorWraper'
import { useState } from 'react'
import useFetch from '../hooks/useFetch'
import { useAuthContext } from '../Auth/AuthProvider'
import pig from '../../public/pig.svg'

const regErrorInitialData = {
    mail: '',
    password: '',
    passwordCheck: '',
}

const Register = () => {
    const { setAuthUser } = useAuthContext()
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)
    const [regError, setRegError] = useState(regErrorInitialData)
    const [regData, setRegData] = useState({
        name: '',
        lastName: '',
        email: '',
        password: '',
        passwordCheck: '',
        birthdate: '',
    });

    const handleRegError = (errorResponse) => {
        if (errorResponse?.status?.email){
            setRegError({...regError, mail:'El mail ya se encuentra registrado'})
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true)
        const pw = regData.password
        const pwc = regData.passwordCheck
        if (pw !== pwc) {
            setRegError({
                ...regError,
                password:'Contraseña y verificacion deben ser iguales',
                passwordCheck:'Contraseña y verificacion deben ser iguales'
            })
            setLoading(false)
            return
        }

        const [data, error] = await useFetch('/register', 'POST', regData);
        if (data) {
            localStorage.setItem('token', data.data.token)
            localStorage.setItem('user', JSON.stringify(data.data.user))
            setAuthUser(data.data.user)
            navigate('/')
            setLoading(false)
        } else {
            setError(error.response.data.message)
            handleRegError(error.response.data)
            setLoading(false)
        }
    }

    const handleChange = (event) => {
        setError(null)
        setRegError(regErrorInitialData)
        const field = event.target.name;
        const value = event.target.value;
        setRegData({ ...regData, [field]: value })
    };

    return (
        <Box display='flex' flexDirection='column' gap={2} justifyContent='center' alignItems='center' minWidth='90%' bgcolor='' padding={4} marginTop={4}>
            <Typography color='white' variant='h3'>Bienvenido a Broken-Pig</Typography>
            <Typography color='white' variant='h5'>Registrate y comenza a gestionar tus finanzas de la forma mas ordenada</Typography>
            <Box display='flex' bgcolor='whitesmoke' flexDirection='column' justifyContent='center' width='40%' padding={4} gap={2} borderRadius={4} boxShadow={'6px 6px 16px #f8b64c88'}>
                <Box display='flex' justifyContent='center' gap={2} alignItems='center' flexDirection='column'>
                    <img src={pig} width={90} />
                    <Typography variant='h5'>Ingreso</Typography>
                </Box>
                <LoadingErrorWraper error={error}>
                    <form onSubmit={handleSubmit}>
                    <Box display='flex' flexDirection='column' gap={1}>
                        <FormLabel title='Nombre' htmlFor='name'>Nombre</FormLabel>
                        <TextField
                            required
                            id='name'
                            name='name'
                            type='text'
                            size='small'
                            value={regData.name}
                            onChange={handleChange}
                        />
                        <FormLabel title='Apellido' htmlFor='lastName'>Apellido</FormLabel>
                        <TextField
                            required
                            id='lastName'
                            name='lastName'
                            type='text'
                            size='small'
                            value={regData.lastName}
                            onChange={handleChange}
                        />
                        <FormLabel title='Mail' htmlFor='email'>Mail</FormLabel>
                        <TextField
                            required
                            size='small'
                            id='email'
                            error={Boolean(regError.mail)}
                            helperText={regError.mail}
                            name='email'
                            type='email'
                            value={regData.email}
                            onChange={handleChange}
                        />
                        <FormLabel title='Fecha de nacimiento' htmlFor='birthdate'>Fecha de nacimiento</FormLabel>
                        <input
                            required
                            style={{
                                height: '40px',
                                borderRadius: '5px',
                                color: 'grey',
                                border: '1px solid',
                                borderColor: 'lightgray'
                            }}
                            type='date'
                            name='birthdate'
                            id='birthday'
                            value={regData.birthdate}
                            onChange={handleChange}
                        />
                        <FormLabel title='Contraseña' htmlFor='password'>Contraseña</FormLabel>
                        <TextField
                            required
                            id='password'
                            error={Boolean(regError.password)}
                            helperText={regError.password}
                            name='password'
                            size='small'
                            type='password'
                            value={regData.password}
                            onChange={handleChange}
                        />
                        <FormLabel title='Repetir Contraseña' htmlFor='passwordCheck'>Repetir contraseña</FormLabel>
                        <TextField
                            required
                            id='passwordCheck'
                            error={Boolean(regError.passwordCheck)}
                            helperText={regError.passwordCheck}
                            name='passwordCheck'
                            size='small'
                            type='password'
                            value={regData.passwordCheck}
                            onChange={handleChange}
                        />
                        <Button variant='contained' disabled={loading} type='submit'>{loading ? <CircularProgress /> : 'Registrame'}</Button>
                        </Box>
                    </form>
                </LoadingErrorWraper>
                <Button variant='outlined' onClick={() => navigate('/login')}>Ingresar</Button>
            </Box>
        </Box>
    )
}

export default Register