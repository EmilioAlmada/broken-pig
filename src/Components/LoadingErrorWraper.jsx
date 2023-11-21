import { CircularProgress, Alert } from '@mui/material'

const LoadingErrorWraper = ({ children, loading=false, error=null }) => {
    if (loading) return <LoadingComponent />
    return (
        <>
            {children}
            {
                error && 
                <Alert title='Error' typeof='danger'/>
            }
        </>
    )
}

export default LoadingErrorWraper

export const LoadingComponent = () => {
    return (
        <CircularProgress />
    )
}