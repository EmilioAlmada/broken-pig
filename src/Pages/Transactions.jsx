import { useCallback, useEffect, useState } from "react"
import { useAuthContext } from "../Auth/AuthProvider";
import LoadingErrorWraper from "../Components/LoadingErrorWraper";
import { Box, Button, Chip, CircularProgress, Container, FormLabel, IconButton, MenuItem, Modal, Paper, Select, TextField, Typography } from "@mui/material";
import useFetch from "../hooks/useFetch";
import { DataGrid } from "@mui/x-data-grid";
import { Add, ArrowBackIos, ArrowForwardIos, CurrencyExchange, InsertInvitation } from "@mui/icons-material";

const Transactions = () => {
    const { authUser } = useAuthContext()

    return (
        <Box display='flex' flexDirection='row' flexWrap='wrap' gap={3} padding={3} justifyContent='center' alignItems='center' width='100%'>
            <LoadingErrorWraper loading={!authUser}>
                <UserTransactions />
                <UserContacts />
            </LoadingErrorWraper>
        </Box>
    )
}

export default Transactions

const UserContacts = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [contacts, setContacts] = useState(null);

    const getUserContacts = useCallback(async () => {
        const [data,error] = await useFetch(`/contacts`,'GET',null,true);
        if(data) {
            setContacts(data.data)
            setLoading(false)
        }else{
            setError(error)
        }
    },[])

    useEffect(() => {
        getUserContacts()
    }, [getUserContacts]);

    return (
        <LoadingErrorWraper loading={loading} error={error}>
            <ContactList contacts={contacts} />
        </LoadingErrorWraper>
    )
}

const ContactList = ({contacts}) => {
    
    const [newTransactionModal, setNewTransactionModal] = useState(false)
    const [newContactModal, setNewContactModal] = useState(false)
    const columns = [
        { field: 'name', headerName: 'Nombre', minWidth: 150, renderCell: row => <div>{row.row.name}</div> },
        { field: 'cvu', headerName: 'CVU', minWidth: 180, renderCell: row => <div>{`${row.row.cvu}`}</div> },
        { field: 'alias', headerName: 'Alias', minWidth: 150, renderCell: row => <div>{row.row.alias}</div> },
        { field: 'action', headerName: 'Transferir', minWidth: 150, renderCell: row => <div><IconButton onClick={() => handleModalOpen(row.row)}><CurrencyExchange /></IconButton></div> },
    ]

    const [trxInfo, setTrxInfo] = useState({
        alias:null,
        cvu:null,
    })

    const handleModalOpen = (contact) => {
        setTrxInfo({
            alias: contact.alias,
            cvu: contact.cvu,
        })
        setNewTransactionModal(true)
    }

    return (
        <>
            <Box display='flex' bgcolor='whitesmoke'  boxShadow={'6px 6px 16px #f8b64c88'} borderRadius={4} minWidth='60%' justifyContent='center' alignItems='center' gap={2} padding={2} flexDirection='column'>
                <Typography alignSelf='flex-start' variant="h4">Contactos</Typography>
                {contacts?.length ?
                    <DataGrid
                        columns={columns}
                        rows={contacts}
                        disableRowSelectionOnClick
                        hideFooter
                        disableColumnFilter
                        rowSelection={false}
                    />
                    :
                    <Typography>No tiene ningun contacto</Typography>
                }
                <Box display='flex' justifyContent='space-around' gap={2}>
                    <Button onClick={() => setNewContactModal(true)} variant="contained" style={{ minWidth: 170, textAlign: 'center', display: 'flex', justifyContent: 'baseline', alignItems: 'center' }}><Add />Añadir contacto</Button>
                </Box>
            </Box>
            <Modal style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} open={newTransactionModal} onClose={() => setNewTransactionModal(false)}>
                <NewTransactionForm cvuD={trxInfo.cvu} aliasD={trxInfo.alias} />
            </Modal>
            <Modal style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} open={newContactModal} onClose={() => setNewContactModal(false)}>
                <NewContactForm />
            </Modal>
        </>
    )
}

const UserTransactions = () => {
    const [transactions, setTransactions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const getUserBalanceInformation = useCallback(async () => {
        const [data, error] = await useFetch(`/transactions?page=${page}&perPages=${perPage}`, 'GET', null, true);
        if (data) {
            setTransactions(data.data)
            setLoading(false)
        }else{
            setError(error)
        }
    },[page,perPage])

    useEffect(() => {
        getUserBalanceInformation()
    }, [getUserBalanceInformation, page, perPage]);

    return (
        <LoadingErrorWraper loading={loading} error={error}>
            <TransactionsInner
                transactions={transactions}
                page={page}
                setPage={setPage}
                setPerPage={setPerPage}
                perPage={perPage}
            />
        </LoadingErrorWraper>
    );
}

const TransactionsInner = ({
    transactions,
    perPage,
    setPerPage,
    setPage,
    page,
}) => {
    const [newTransactionModal, setNewTransactionModal] = useState(false)
    const columns = [
        { field: 'to', headerName: 'Destinatario', minWidth: 200, renderCell: row => <div>{row.row.to}</div> },
        { field: 'ammount', headerName: 'Monto', minWidth: 200, renderCell: row => <div>{`$ ${row.row.ammount}`}</div> },
        { field: 'created_at', headerName: 'Fecha', minWidth: 200, renderCell: row => <div>{row.row.created_at.slice(0, 10)}</div> },
    ]


    const handleModalOpen = () => {
        setNewTransactionModal(true)
    }

    return (
        <>
            <Box display='flex' bgcolor='whitesmoke' maxHeight='35em' boxShadow={'6px 6px 16px #f8b64c88'} borderRadius={4} minWidth='60%' justifyContent='center' alignItems='center' gap={2} padding={2} flexDirection='column'>
                <Typography alignSelf='flex-start' variant="h4">Transferencias</Typography>
                {transactions?.transactionHistory?.length ?
                    <>
                        <DataGrid
                            columns={columns}
                            rows={transactions.transactionHistory}
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
                            totalRecords={transactions.totalRecords}
                        />
                    </>
                    :
                    <Typography>No tiene ningun registro de transferencia</Typography>
                }
                <Box display='flex' justifyContent='space-around' gap={2}>
                    <Button onClick={() => handleModalOpen('out')} variant="contained" style={{ minWidth: 170, textAlign: 'center', display: 'flex', justifyContent: 'baseline', alignItems: 'center' }}><Add />Nueva Transferencia</Button>
                </Box>
            </Box>
            <Modal style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} open={newTransactionModal} onClose={() => setNewTransactionModal(false)}>
                <NewTransactionForm />
            </Modal>
        </>
    )
}

export const PaginationComponent = ({perPage, page, setPage, setPerPage, totalRecords}) => {
    return (
        <Box display='flex' alignItems='center' justifyContent='flex-end' width='80%'>
            <Typography marginRight={1}>Filas por pagina:</Typography>
            <Select style={{ height: '2em', marginRight: '1em' }} size="small" value={perPage} onChange={v => setPerPage(v.target.value)}>
                <MenuItem value={10} >10</MenuItem>
                <MenuItem value={20} >20</MenuItem>
                <MenuItem value={50} >50</MenuItem>
                <MenuItem value={100} >100</MenuItem>
            </Select>
            <Box><IconButton disabled={page === 1} onClick={() => setPage(p => p - 1)}><ArrowBackIos style={{ width: '0.7em' }} /></IconButton></Box>
            <Box>{`Pagina: ${page} de ${Number(Math.ceil(totalRecords / perPage))}`}</Box>
            <Box><IconButton
                disabled={page === Number(Math.ceil(totalRecords / perPage))}
                onClick={() => setPage(p => p + 1)}
            ><ArrowForwardIos style={{ width: '0.7em' }} /></IconButton></Box>
        </Box>
    )
}

const NewContactForm = () => {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)
    const [contactData, setContactData] = useState({
        cvu: '',
        alias: '',
    });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true)

        const [data, error] = await useFetch('/contact', 'POST', contactData, true);
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
        setContactData({ ...contactData, [field]: value })
    };

    return (
        <Box  bgcolor='whitesmoke' boxShadow={'6px 6px 16px #f8b64c88'} padding={3}  borderRadius={4}>
            <LoadingErrorWraper error={error}>
                <form onSubmit={handleSubmit}>
                    <Box display='flex' flexDirection='column' gap={1} padding={4}>
                        <Typography variant="h5">Añadir contacto</Typography>
                        <FormLabel title='cvu' htmlFor='cvu'>CVU</FormLabel>
                        <TextField
                            id='cvu'
                            name='cvu'
                            type='text'
                            size='small'
                            value={contactData.cvu}
                            onChange={handleChange}
                        />
                        <FormLabel title='Alias' htmlFor='alias'>Alias</FormLabel>
                        <TextField
                            size='small'
                            id='alias'
                            name='alias'
                            type='text'
                            value={contactData.alias}
                            onChange={handleChange}
                        />
                        <Button variant="contained" disabled={loading} type='submit'>{loading ? <CircularProgress /> : 'Añadir'}</Button>
                    </Box>
                </form>
            </LoadingErrorWraper>
        </Box>
    )
}

const trxErrorInitialData = {
    cvu: '',
    alias: '',
}

const NewTransactionForm = ({cvuD = null, aliasD=''}) => {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)
    const [trxError, setTrxError] = useState(trxErrorInitialData)
    const [transferData, setTransferData] = useState({
        cvu: '',
        alias: '',
        ammount: 0,
    });

    useEffect(() => {
        setTransferData({
            ...transferData,
            cvu: cvuD ?? '',
            alias: aliasD ?? '',
        })
    },[cvuD,aliasD])

    const handleSubmit = async e => {
        e.preventDefault();

        const alias = transferData.alias
        const cvu = transferData.cvu
        if (alias === ''  && cvu === '') {
            setTrxError({
                ...trxError,
                cvu:'Al menos debe indicar uno de estos datos',
                alias:'Al menos debe indicar uno de estos datos'
            })
            return
        }

        if (transferData.ammount <= 0) {
            setTrxError({
                ...trxError,
                ammount:'El monto debe ser mayor a cero',
            })
            return
        }
        setLoading(true)

        const [data, error] = await useFetch('/transaction', 'POST', transferData, true);
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
        setTrxError(trxErrorInitialData)
        const field = event.target.name;
        const value = event.target.value;
        setTransferData({ ...transferData, [field]: value })
    };

    return (
        <Box  bgcolor='whitesmoke' boxShadow={'6px 6px 16px #f8b64c88'} padding={3}  borderRadius={4}>
            <LoadingErrorWraper error={error}>
                <form onSubmit={handleSubmit}>
                    <Box display='flex' flexDirection='column' gap={1} padding={4}>
                        <Typography variant="h5">Transferir dinero a otra cuenta</Typography>
                        <FormLabel title='Monto' htmlFor='ammount'>Monto</FormLabel>
                        <TextField
                            required
                            id='ammount'
                            error={Boolean(trxError.ammount)}
                            helperText={trxError.ammount}
                            name='ammount'
                            type='number'
                            size='small'
                            value={transferData.ammount}
                            onChange={handleChange}
                        />
                        <FormLabel title='cvu' htmlFor='cvu'>CVU</FormLabel>
                        <TextField
                            id='cvu'
                            name='cvu'
                            error={Boolean(trxError.cvu)}
                            helperText={trxError.cvu}
                            type='text'
                            size='small'
                            value={transferData.cvu}
                            onChange={handleChange}
                        />
                        <FormLabel title='Alias' htmlFor='alias'>Alias</FormLabel>
                        <TextField
                            size='small'
                            id='alias'
                            error={Boolean(trxError.alias)}
                            helperText={trxError.alias}
                            name='alias'
                            type='text'
                            value={transferData.alias}
                            onChange={handleChange}
                        />
                        <Button variant="contained" disabled={loading} type='submit'>{loading ? <CircularProgress /> : 'Transferir'}</Button>
                    </Box>
                </form>
            </LoadingErrorWraper>
        </Box>
    )
}