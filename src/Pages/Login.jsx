import { useNavigate } from 'react-router-dom'
import { Container, Box, TextField, Button, FormLabel, CircularProgress, Paper, Typography } from '@mui/material'
import LoadingErrorWraper from '../Components/LoadingErrorWraper'
import { useState } from 'react'
import useFetch from '../hooks/useFetch'
import { useAuthContext } from '../Auth/AuthProvider'
import pig from '../../public/pig.svg'

const Login = () => {
    const { setAuthUser } = useAuthContext();
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true)

        const [data, error] = await useFetch('/login', 'POST', loginData);
        if (data) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.data))
            setAuthUser(data.data)
            navigate('/')
            setLoading(false)
        } else {
            setError(error.response.data.message)
            setLoading(false)
        }
    }

    const handleChange = (event) => {
        setError(null)
        const field = event.target.name;
        const value = event.target.value;
        setLoginData({ ...loginData, [field]: value })
    };

    return (
        <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' gap={2} minWidth='90%' padding={4} marginTop={4}>
            <Typography color='white' variant='h3'>Broken-Pig</Typography>
            <Typography color='white' variant='h5'>Gestiona tus finanzas de forma profesional</Typography>
                <Box bgcolor='whitesmoke' display='flex' flexDirection='column' justifyContent='center' width='40%' padding={4} gap={2} borderRadius={4} boxShadow={'6px 6px 16px #f8b64c88'}>
                    <Box display='flex' justifyContent='center' gap={2} alignItems='center' flexDirection='column'>
                        <img src={pig} width={90}/>
                        <Typography variant='h5'>Ingreso</Typography>
                    </Box>
                    <LoadingErrorWraper error={error}>
                        <form onSubmit={handleSubmit}>
                            <Box display='flex' flexDirection='column' gap={1}>
                                <FormLabel title='Mail' htmlFor='email'>Mail</FormLabel>
                                <TextField
                                    required
                                    size='small'
                                    id='email'
                                    name='email'
                                    type='email'
                                    value={loginData.email}
                                    onChange={handleChange}
                                />
                                <FormLabel title='Contraseña' htmlFor='password'>Contraseña</FormLabel>
                                <TextField
                                    required
                                    id='password'
                                    name='password'
                                    size='small'
                                    type='password'
                                    value={loginData.password}
                                    onChange={handleChange}
                                />
                                <Button disabled={loading} variant='contained' type='submit'>{loading ? <CircularProgress /> : 'Ingresar'}</Button>
                            </Box>
                        </form>
                    </LoadingErrorWraper>
                    <Button variant='outlined' onClick={() => navigate('/register')}>Registrarme</Button>
                    <Button onClick={() => navigate('/askpasswordrecover')}>Olvide mi contraseña</Button>
                </Box>
        </Box>
    )
}

export default Login