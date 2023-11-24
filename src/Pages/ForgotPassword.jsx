import { useNavigate } from 'react-router-dom'
import { Container, Box, TextField, Button, FormLabel, CircularProgress, Typography } from '@mui/material'
import LoadingErrorWraper from '../Components/LoadingErrorWraper'
import { useState } from 'react'
import useFetch from '../hooks/useFetch'
import pig from '../../public/pig.svg'

const ForgotPassword = () => {
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [okResponse, setOkResponse] = useState(null)
    const [loading, setLoading] = useState(false)
    const [recoverData, setRecoverData] = useState({ email: '' });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true)

        const [data, error] = await useFetch('/askPasswordRecover', 'POST', recoverData);
        if (data) {
            setLoading(false)
            setOkResponse(data.message)
        } else {
            setError(error.response.data.message)
            setLoading(false)
        }
    }

    const handleChange = (event) => {
        setError(null)
        const field = event.target.name;
        const value = event.target.value;
        setRecoverData({ ...recoverData, [field]: value })
    };

    return (
        <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' gap={2} minWidth='90%' bgcolor='' padding={4} marginTop={4}>
            <Typography color='white' variant='h3'>Broken-Pig</Typography>
            <Typography color='white' variant='h6' textAlign='center' maxWidth='50%'>Ingresa tu email y en el caso de que la cuenta exista te llegara un mail para que puedas cambiar tu contraseña</Typography>
            <Box display='flex' bgcolor='whitesmoke' flexDirection='column' justifyContent='center' width='40%' padding={4} gap={2} borderRadius={4} boxShadow={'6px 6px 16px #f8b64c88'}>
                <Box display='flex' justifyContent='center' gap={2} alignItems='center' flexDirection='column'>
                    <img src={pig} width={90} />
                    <Typography variant='h5'>Recuperacion de cuenta</Typography>
                </Box>
                <LoadingErrorWraper error={error} succesSpecific={okResponse}>
                    <form onSubmit={handleSubmit}>
                    <Box display='flex' flexDirection='column' gap={1}>
                        <FormLabel title='Mail' htmlFor='email'>Mail</FormLabel>
                        <TextField
                            required
                            size='small'
                            id='email'
                            name='email'
                            type='email'
                            value={recoverData.email}
                            onChange={handleChange}
                        />
                        <Button variant='contained' disabled={loading} type='submit'>{loading ? <CircularProgress /> : 'Enviar'}</Button>
                        <Button variant='outlined' disabled={loading} onClick={() => {navigate('/login')}}>Volver al inicio</Button>
                        </Box>
                    </form>
                </LoadingErrorWraper>
            </Box>
        </Box>
    )
}

export default ForgotPassword