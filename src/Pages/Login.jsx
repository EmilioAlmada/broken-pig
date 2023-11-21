import { useNavigate } from 'react-router-dom'
import { Container, Box, TextField, DatePicker, Button } from '@mui/material'
import LoadingErrorWraper from '../Components/LoadingErrorWraper'
import { useState } from 'react'

const Login = () => {

    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [regData, setRegData] = useState({
        name: '',
        lastName: '',
        email: '',
        password: '',
        passwordCheck: '',
        birthdate: '',
    });

    const handleSubmit = async e => {
        e.preventDefault();
        // /* Validación de campos */
        // if ([nombre, apellido, email, contraseña, repetirPassword].includes('')) {
        //     setAlerta({
        //         msg: 'Todos los campos son obligatorios',
        //         error: true
        //     })
        //     return
        // }

        // if (contraseña !== repetirPassword) {
        //     setAlerta({
        //         msg: 'No coinciden los password',
        //         error: true
        //     })
        //     return
        // }

        // if (contraseña.length < 6) {
        //     setAlerta({
        //         msg: 'El password debe tener al menos 6 caracteres',
        //         error: true
        //     })
        //     return
        // }

        setAlerta({})

        const [data, error] = await useFetch('/register', 'POST', regData);
        if (data) {
            localStorage.setItem('token', data.token)
            navigate('/')
            setLoading(false)
        } else {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
  }

    const handleChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;
        setRegData({ ...regData, [field]: value })
    };

    return (
        <Container>
            <Box>
                <LoadingErrorWraper error={error}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            id='name'
                            name='name'
                            type='text'
                            value={regData.name}
                            handleChange={handleChange}
                        />
                        <TextField
                            id='lastName'
                            name='lastName'
                            type='text'
                            value={regData.lastName}
                            handleChange={handleChange}
                        />
                        <TextField
                            id='password'
                            name='password'
                            type='password'
                            value={regData.password}
                            handleChange={handleChange}
                        />
                        <TextField
                            id='email'
                            name='email'
                            type='email'
                            value={regData.email}
                            handleChange={handleChange}
                        />
                        <DatePicker
                            id='birthdate'
                            name='birthdate'
                            type='birthdate'
                            value={regData.birthdate}
                            handleChange={handleChange}
                        />
                        <Button type='submit'>Registrame</Button>
                    </form>
                </LoadingErrorWraper>
            </Box>
        </Container>
    )
}

export default Login