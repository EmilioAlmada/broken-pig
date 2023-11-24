import { CircularProgress, Alert, Box } from '@mui/material'

const LoadingErrorWraper = ({ children, loading=false, error=null, succesSpecific=null }) => {
    if (loading) return <LoadingComponent />
    return (
        <>
            {children}
            {
                error && 
                <Alert title='Error' severity='error' color='error'>{error}</Alert>
            }
            {
                succesSpecific && 
                <Alert title='Exito' severity='success' color='success'>{succesSpecific}</Alert>
            }
        </>
    )
}

export default LoadingErrorWraper

export const LoadingComponent = () => {
    return (
        <Box minWidth='60%' marginTop={5} padding={4} minHeight='90%' display='flex' alignItems='center' justifyContent='center' borderRadius={4} bgcolor='whitesmoke'>
            <CircularProgress />
        </Box>
    )
}