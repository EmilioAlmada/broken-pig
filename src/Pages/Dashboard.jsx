import { useCallback, useEffect, useState } from "react"
import { useAuthContext } from "../Auth/AuthProvider";
import LoadingErrorWraper from "../Components/LoadingErrorWraper";
import { Box, Button, Chip, CircularProgress, Container, FormLabel, IconButton, MenuItem, Modal, Paper, Select, TextField, Typography } from "@mui/material";
import useFetch from "../hooks/useFetch";
import { DataGrid } from "@mui/x-data-grid";
import { Add, ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { PaginationComponent } from "./Transactions";
// import { Chart as ChartJs } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
} from "chart.js";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
)

const Dashboard = () => {
    const { authUser } = useAuthContext()

    return (
        <Box display='flex' flexDirection='column' padding={3} justifyContent='center' alignItems='center' width='100%'>
            <LoadingErrorWraper loading={!authUser}>
                <UserBalance />
            </LoadingErrorWraper>
        </Box>
    )
}

const LineChart = () => {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const getUserBalanceInformation = useCallback(async () => {
        const [data, error] = await useFetch(`balance?page=1&perPages=${'10000'}`, 'GET', null, true);
        if (data) {
            setBalance(data.data)
            setLoading(false)
        } else {
            setLoading(false)
            setError(error)
        }
    }, [])

    useEffect(() => {
        getUserBalanceInformation()
    }, [getUserBalanceInformation]);

    return (
        <LoadingErrorWraper loading={loading}>
            <LineInner balance={balance} />
        </LoadingErrorWraper>
    )
}

const LineInner = ({balance}) => {
    const bal = balance.balanceHistory.sort((a,b) => a.id - b.id)
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Balance',
            },
        },
        scales:{
            y:{
                min: -100,
                max: 300000,
            }
        }
    };

    const labels = bal.map(item => item.created_at.slice(0,9));

    const data = {
        labels,
        datasets: [
            {
                labels: 'Balance',
                data: bal.map(item => item.total),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };


    return (
        <Box display='flex' minWidth='67%' marginTop={2} bgcolor='whitesmoke' maxHeight='50em' justifyContent='center' alignItems='center' gap={2} padding={4} flexDirection='column' borderRadius={4} boxShadow={'6px 6px 16px #f8b64c88'}>
            <Typography alignSelf='flex-start' variant="h5">Historico Balance</Typography>
            {balance?.balanceHistory?.length &&
                <Line options={options} data={data} />
            }
        </Box>
    )
}

export default Dashboard

const UserBalance = () => {
    const [userBalance, setUserBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const getUserBalanceInformation = useCallback(async () => {
        const [data, error] = await useFetch(`balance?page=${page}&perPages=${perPage}`, 'GET', null, true);
        if (data) {
            setUserBalance(data.data)
            setLoading(false)
        } else {
            setError(error)
        }
    }, [page, perPage])

    useEffect(() => {
        getUserBalanceInformation()
    }, [getUserBalanceInformation, page, perPage]);

    return (
        <LoadingErrorWraper loading={loading} error={error}>
            <BalanceInner
                balance={userBalance}
                page={page}
                setPage={setPage}
                setPerPage={setPerPage}
                perPage={perPage}
            />
            <LineChart />
        </LoadingErrorWraper>
    );
}

const BalanceInner = ({
    balance,
    perPage,
    setPerPage,
    setPage,
    page,
}) => {
    const [newBalanceModal, setNewBalanceModal] = useState(false)
    const [movementType, setMovementType] = useState('')
    const BALANCE_TYPE = { in: 'Ingreso', out: 'Egreso' }
    const BALANCE_CATEGORY_COLOR = {
        Otro: 'grey',
        Transferencia: 'orange',
        Mercado: 'green',
        Inversion: 'purple',
        Alquiler: 'red',
        Expensas: 'yellow',
        Salario: 'magenta',
    }
    const BALANCE_CATEGORY_FONT_COLOR = {
        Otro: 'white',
        Transferencia: 'black',
        Mercado: 'white',
        Inversion: 'white',
        Alquiler: 'white',
        Expensas: 'black',
        Salario: 'black',
    }
    const columns = [
        {
            field: 'category',
            headerName: 'Tipo',
            minWidth: 150,
            renderCell: row => <div><Chip style={{ backgroundColor: BALANCE_CATEGORY_COLOR[row.row.category.name], color: BALANCE_CATEGORY_FONT_COLOR[row.row.category.name], fontWeight: 'bold' }} variant="filled" label={row.row.category.name} /></div>
        },
        { field: 'ammount', headerName: 'Monto', minWidth: 150, renderCell: row => <div style={{ color: row.row.type === 'out' ? 'red' : 'green' }}>{`${row.row.type === 'out' ? '-' : ''} $ ${row.row.ammount}`}</div> },
        { field: 'total', headerName: 'Balance Total', minWidth: 150, renderCell: row => <div>{`$ ${row.row.total}`}</div> },
        { field: 'type', headerName: 'Egreso/Ingreso', minWidth: 150, renderCell: row => <div style={{ color: row.row.type === 'out' ? 'red' : 'green' }}>{BALANCE_TYPE[row.row.type]}</div> },
        { field: 'created_at', headerName: 'Fecha', minWidth: 150, renderCell: row => <div>{row.row.created_at.slice(0, 10)}</div> },
    ]

    const handleModalOpen = (moveType) => {
        setMovementType(moveType)
        setNewBalanceModal(true)
    }

    return (
        <>
            <Box display='flex' minWidth='60%' bgcolor='whitesmoke' maxHeight='50em' justifyContent='center' alignItems='center' gap={2} padding={4} flexDirection='column' borderRadius={4} boxShadow={'6px 6px 16px #f8b64c88'}>
                <Typography alignSelf='flex-start' variant="h4">Balance</Typography>
                <Box border={`solid 1px ${balance.currentAmmount > 0 ? 'green' : 'red'}`} borderRadius='1em 0.1em 1em 0.1em' padding={1} alignSelf='flex-end'>
                    <Typography variant="h6" color={balance.currentAmmount > 0 ? 'green' : 'error'}>{`Balance actual : $ ${parseFloat(balance.currentAmmount).toLocaleString()}`}</Typography>
                </Box>
                {balance.balanceHistory.length ?
                    <>
                        <DataGrid
                            columns={columns}
                            rows={balance?.balanceHistory}
                            disableRowSelectionOnClick
                            hideFooter
                            disableColumnFilter
                            rowSelection={false}
                        />
                        <PaginationComponent
                            page={page}
                            perPage={perPage}
                            setPage={setPage}
                            setPerPage={setPerPage}
                            totalRecords={balance.totalRecords}
                        />
                    </>
                    :
                    <Typography>No tiene ningun registro en el balance</Typography>
                }
                <Box display='flex' justifyContent='space-around' gap={2}>
                    <Button onClick={() => handleModalOpen('out')} color="error" variant="contained" style={{ minWidth: 170, textAlign: 'center', display: 'flex', justifyContent: 'baseline', alignItems: 'center' }}><Add />Nuevo Gasto</Button>
                    <Button onClick={() => handleModalOpen('in')} color="success" variant="contained" style={{ minWidth: 170, textAlign: 'center', display: 'flex', justifyContent: 'baseline', alignItems: 'center' }}><Add />Nuevo Ingreso</Button>
                </Box>
            </Box>
            <Modal style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} open={newBalanceModal} onClose={() => setNewBalanceModal(false)}>
                <Box boxShadow={'6px 6px 16px #f8b64c88'} bgcolor='whitesmoke' borderRadius={4}>
                    <NewBalanceForm movementType={movementType} />
                </Box>
            </Modal>
        </>
    )
}

const NewBalanceForm = ({ movementType }) => {
    const [error, setError] = useState(null)
    const [basicData, setBasicData] = useState(null)
    const [loading, setLoading] = useState(null)
    const [moveData, setMoveData] = useState({
        ammount: 0,
        category: 1,
        description: '',
    });

    const getBasicData = useCallback(async () => {
        const [data, error] = await useFetch('/basicData');
        if (data) {
            setBasicData(data.data)
        } else {
            console.error(error)
        }
    }, [])

    useEffect(() => {
        getBasicData()
    }, [getBasicData])

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true)

        let url = ''

        if (movementType === 'in') {
            url = '/active'
        } else if (movementType == 'out') {
            url = '/pasive'  
        }

        const [data, error] = await useFetch(url, 'POST', moveData, true);
        if (data) {
            setLoading(false)
            window.location.reload()
        } else {
            setError(error.response.data.message)
            setLoading(false)
        }
    }

    const handleChange = (event) => {
        setError(null)
        const field = event.target.name;
        const value = event.target.value;
        setMoveData({ ...moveData, [field]: value })
    };

    if (!Boolean(basicData)) return <Box minWidth={200}><CircularProgress /></Box>

    return (
        <Box padding={3} borderRadius={2}>
            <LoadingErrorWraper error={error}>
                <form onSubmit={handleSubmit}>
                    <Box display='flex' flexDirection='column' gap={1} padding={4}>
                        <Typography variant="h5">{movementType === 'in' ? 'Registro de ingreso' : 'Registro de gasto'}</Typography>
                        <FormLabel title='Monto' htmlFor='ammount'>Monto</FormLabel>
                        <TextField
                            required
                            id='ammount'
                            name='ammount'
                            type='number'
                            size='small'
                            value={moveData.ammount}
                            onChange={handleChange}
                        />
                        <FormLabel title='Categoria' htmlFor='category'>Categoria</FormLabel>
                        <Select
                            name="category"
                            size="small"
                            value={moveData.category}
                            onChange={handleChange}
                        >
                            {basicData.categories.map(item => (
                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                            ))}
                        </Select>
                        <FormLabel title='Descripcion' htmlFor='description'>Descripcion</FormLabel>
                        <TextField
                            size='small'
                            id='description'
                            name='description'
                            type='text'
                            value={moveData.description}
                            onChange={handleChange}
                        />
                        <Button variant="contained" disabled={loading} type='submit'>{loading ? <CircularProgress /> : 'Guardar'}</Button>
                    </Box>
                </form>
            </LoadingErrorWraper>
        </Box>
    )
}