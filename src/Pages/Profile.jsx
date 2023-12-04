import { useNavigate } from 'react-router-dom'
import { Container, Box, TextField, Button, FormLabel, CircularProgress, Typography, IconButton } from '@mui/material'
import LoadingErrorWraper from '../Components/LoadingErrorWraper'
import { useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch'
import { useAuthContext } from '../Auth/AuthProvider'
import pig from '../../public/pig.svg'
import { CopyAll } from '@mui/icons-material'

const updateErrorInitialData = {
    name: '',
    lastName: '',
    alias: '',
    birthdate: '',
}

const Profile = () => {
    const { setAuthUser, authUser } = useAuthContext()
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)
    const [updateError, setUpdateError] = useState(updateErrorInitialData)
    const [updateData, setUpdateData] = useState({
        name: '',
        lastName: '',
        alias: '',
        cvu: '',
        email: '',
        birthdate: '',
    });

    useEffect(()=> {
        if(authUser) {
            setUpdateData({
                name: authUser.name,
                lastName: authUser.lastName,
                alias: authUser.alias,
                birthdate: authUser.birthdate,
                email: authUser.email,
                cvu: authUser.cvu,
            });
            setPageLoading(false)
        }
    },[authUser])

    const handleUpdateError = (errorResponse) => {
        if (errorResponse?.status?.name){
            setUpdateError({...updateError, name:'El campo es obligatorio'})
        }
        if (errorResponse?.status?.lastName){
            setUpdateError({...updateError, lastName:'El campo es obligatorio'})
        }
        if (errorResponse?.status?.alias){
            setUpdateError({...updateError, alias:'El campo es obligatorio'})
        }
        if (errorResponse?.status?.birthdate){
            setUpdateError({...updateError, birthdate:'El campo es obligatorio'})
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true)

        const [data, error] = await useFetch('/update', 'PUT', updateData, true);
        if (data) {
            localStorage.removeItem('user')
            localStorage.setItem('user', JSON.stringify(data.data))
            setAuthUser(data.data)
            setSuccess('Perfil acutalizado correctamente')
            setLoading(false)
        } else {
            setError(error.response.data.message)
            handleUpdateError(error.response.data)
            setLoading(false)
        }
    }

    const handleChange = (event) => {
        setError(null)
        setUpdateError(updateErrorInitialData)
        const field = event.target.name;
        const value = event.target.value;
        setUpdateData({ ...updateData, [field]: value })
    };

    return (
        <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' gap={2} minWidth='90%' padding={4} marginTop={4}>
            <Box display='flex' bgcolor='whitesmoke' flexDirection='column' justifyContent='center' width='40%' padding={4} gap={2} borderRadius={4} >
                <Box display='flex' justifyContent='center' gap={2} alignItems='center' flexDirection='column'>
                    <Typography variant='h5'>Perfil de usuario</Typography>
                </Box>
                <LoadingErrorWraper error={error} loading={pageLoading} succesSpecific={success}>
                    <InnerForm
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        updateData={updateData}
                        updateError={updateError}
                        loading={loading}
                        authUser={authUser}
                    />
                </LoadingErrorWraper>
            </Box>
        </Box>
    )
}

export default Profile

const InnerForm = ({handleSubmit,handleChange,updateData,updateError,loading, authUser}) => {

    const handleCopy = (text) => {
        navigator.clipboard.writeText('')
        navigator.clipboard.writeText(text)
    }

    return (
        <form onSubmit={handleSubmit}>
            <Box display='flex' flexDirection='column' gap={1}>
                <FormLabel title='Mail' htmlFor='mail'>Mail</FormLabel>
                <TextField
                    required
                    id='mail'
                    name='mail'
                    type='text'
                    size='small'
                    disabled
                    value={updateData.email}
                />
                <FormLabel title='Nombre' htmlFor='name'>Nombre</FormLabel>
                <TextField
                    required
                    id='name'
                    name='name'
                    error={Boolean(updateError.name)}
                    helperText={updateError.name}
                    type='text'
                    size='small'
                    value={updateData.name}
                    onChange={handleChange}
                />
                <FormLabel title='Apellido' htmlFor='lastName'>Apellido</FormLabel>
                <TextField
                    required
                    id='lastName'
                    name='lastName'
                    error={Boolean(updateError.lastName)}
                    helperText={updateError.lastName}
                    type='text'
                    size='small'
                    value={updateData.lastName}
                    onChange={handleChange}
                />
                <FormLabel title='Alias' htmlFor='alias'>Alias</FormLabel>
                <TextField
                    required
                    size='small'
                    id='alias'
                    error={Boolean(updateError.alias)}
                    helperText={updateError.alias}
                    name='alias'
                    type='text'
                    value={updateData.alias}
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
                    value={updateData.birthdate}
                    onChange={handleChange}
                />
                <Box display='flex' width='100%' justifyContent='center' alignItems='center' margin='1em 0 0.1em 0'>
                    <Typography fontWeight='bold' textAlign='center'>{`CVU: ${updateData.cvu}`}</Typography><IconButton onClick={() => handleCopy(updateData.cvu)}><CopyAll /></IconButton>
                </Box>
                <Box display='flex' width='100%' justifyContent='center' alignItems='center' margin='0 0 1em 0'>
                    <Typography fontWeight='bold' textAlign='center'>{`Alias: ${authUser.alias}`}</Typography><IconButton onClick={() => handleCopy(updateData.alias)}><CopyAll /></IconButton>
                </Box>
                <Button variant='contained' disabled={loading} type='submit'>{loading ? <CircularProgress /> : 'Actualizar'}</Button>
            </Box>
        </form>
    )
}