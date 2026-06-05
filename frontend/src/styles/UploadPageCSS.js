const styles = {
    widescreenContainer: {
        display: 'flex',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0d0e12',
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden'
    },

    sidebar: {
        width: '320px',
        height: '100%',
        backgroundColor: '#161822',
        borderRight: '1px solid #242736',
        padding: '28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
    },

    sidebarTitle: {
        fontSize: '20px',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: '#ffffff',
        marginBottom: '24px'
    },

    historyList: {
        flex: 1,
        overflowY: 'auto'
    },

    historyItem: {
        padding: '14px 16px',
        backgroundColor: '#0d0e12',
        border: '1px solid #242736',
        borderRadius: '8px',
        marginBottom: '12px',
        cursor: 'pointer',
        fontSize: '16px',
        color: '#e2e8f0',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },

    emptyText: {
        color: '#64748b',
        fontSize: '16px'
    },

    mainContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    },

    authBanner: {
        display: 'flex',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid #242736',
        backgroundColor: '#161822',
        justifyContent: 'space-between'
    },

    guestNotice: {
        color: '#cbd5e1',
        fontSize: '20px',
        fontWeight: '500'
    },

    welcomeMessage: {
        color: '#ffffff',
        fontSize: '20px',
        fontWeight: '500'
    },

    authBtn: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#ffffff',
        marginRight: '15px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '16px'
    },

    authBtnPrimary: {
        backgroundColor: '#ffb300',
        border: 'none',
        color: '#0d0e12',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '700',
        fontSize: '16px'
    },

    secondaryBtn: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid #ef4444',
        color: '#ef4444',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '15px'
    },

    uploaderCenter: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px'
    },

    titleHead: {
        fontSize: '38px',
        fontWeight: '800',
        letterSpacing: '3px',
        color: '#ffb300',
        margin: '0 0 10px 0'
    },

    tagline: {
        color: '#94a3b8',
        fontSize: '17px',
        margin: '0 0 45px 0',
        textAlign: 'center'
    },

    uploadForm: {
        width: '100%',
        maxWidth: '550px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },

    fileInput: {
        display: 'none'
    },

    dropZone: {
        width: '100%',
        height: '220px',
        border: '2px dashed #242736',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#94a3b8',
        cursor: 'pointer',
        boxSizing: 'border-box',
        padding: '24px',
        textAlign: 'center',
        marginBottom: '28px',
        fontSize: '17px'
    },

    submitBtn: {
        width: '100%',
        padding: '16px',
        backgroundColor: '#ffb300',
        color: '#0d0e12',
        border: 'none',
        borderRadius: '6px',
        fontWeight: '700',
        fontSize: '18px',
        cursor: 'pointer'
    }
};

export { styles };