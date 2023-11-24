import { useNavigate, useParams } from 'react-router-dom'
import { Container, Box, TextField, Button, FormLabel, CircularProgress, Typography } from '@mui/material'
import LoadingErrorWraper from '../Components/LoadingErrorWraper'
import { useState } from 'react'
import useFetch from '../hooks/useFetch'
import clienteAxios from '../helpers/clientAxios'
import pig from '../../public/pig.svg'

const resErrorInitialData = {
    pwd: '',
    passwordCheck: '',
}

const ResetPassord = () => {
    const navigate = useNavigate()
    const { token } = useParams();
    const [error, setError] = useState(null)
    const [resError, setResError] = useState(resErrorInitialData)
    const [loading, setLoading] = useState(false)
    const [resetData, setResetData] = useState({
        pwd: '',
        passwordCheck: '',
    });

    const handleSubmit = async e => {
        e.preventDefault();
        const pw = resetData.pwd
        const pwc = resetData.passwordCheck
        if (pw !== pwc) {
            setResError({
                ...resError,
                pwd:'Contraseña y verificacion deben ser iguales',
                passwordCheck:'Contraseña y verificacion deben ser iguales'
            })
            return
        }
        setLoading(true)

        const requestData = {
            method: 'POST',
            url: '/resetPassword',
            responseType: 'json',
            data: resetData,
            headers: {
                'Authorization':token,
            }
        }

        try {
            const response = await clienteAxios(requestData);
            navigate('/')
            setLoading(false)
        } catch (error) {
            setError(error.response.data.message)
            setLoading(false)
        }
    }

    const handleChange = (event) => {
        setError(null)
        setResError(resErrorInitialData)
        const field = event.target.name;
        const value = event.target.value;
        setResetData({ ...resetData, [field]: value })
    };

    return (
        <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' gap={2} minWidth='90%' bgcolor='' padding={4} marginTop={4}>
            <Typography color='white' variant='h3'>Broken-Pig</Typography>
            <Typography color='white' variant='h6' textAlign='center' maxWidth='50%'>Ingrese su nueva contraseña</Typography>
            <Box display='flex' bgcolor='whitesmoke' flexDirection='column' justifyContent='center' width='30%' padding={4} gap={2} borderRadius={4} boxShadow={'6px 6px 16px #f8b64c88'}>
                <Box display='flex' justifyContent='center' gap={2} alignItems='center' flexDirection='column'>
                    <img src={pig} width={90} />
                    <Typography variant='h5'>Recuperacion de cuenta</Typography>
                </Box>
                <LoadingErrorWraper error={error}>
                    <form onSubmit={handleSubmit}>
                    <Box display='flex' flexDirection='column' gap={1}>
                        <FormLabel title='Contraseña' htmlFor='pwd'>Contraseña</FormLabel>
                        <TextField
                            required
                            id='password'
                            error={Boolean(resError.pwd)}
                            helperText={resError.pwd}
                            name='pwd'
                            size='small'
                            type='password'
                            value={resetData.pwd}
                            onChange={handleChange}
                        />
                        <FormLabel title='Repetir Contraseña' htmlFor='passwordCheck'>Repetir contraseña</FormLabel>
                        <TextField
                            required
                            id='passwordCheck'
                            error={Boolean(resError.passwordCheck)}
                            helperText={resError.passwordCheck}
                            name='passwordCheck'
                            size='small'
                            type='password'
                            value={resetData.passwordCheck}
                            onChange={handleChange}
                        />
                        <Button variant='contained' disabled={loading} type='submit'>{loading ? <CircularProgress /> : 'Enviar'}</Button>
                        </Box>
                    </form>
                </LoadingErrorWraper>
            </Box>
        </Box>
    )
}

export default ResetPassord