const styles = {
    panoramicWrapper: {
        width: '100%',
        minHeight: '100vh',
        padding: '30px 40px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxSizing: 'border-box',
        backgroundColor: '#0d0e12'
    },

    loadingDisplay: {
        textAlign: 'center',
        padding: '100px',
        color: '#ffb300',
        backgroundColor: '#0d0e12',
        minHeight: '100vh',
        fontSize: '20px',
        fontWeight: '600',
        letterSpacing: '1px'
    },

    errorContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0d0e12'
    },

    errorCard: {
        backgroundColor: '#161822',
        padding: '35px',
        borderRadius: '12px',
        textAlign: 'center',
        border: '1px solid #ef4444',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        maxWidth: '450px'
    },

    actionBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
        borderBottom: '1px solid #242736',
        paddingBottom: '16px',
        width: '100%'
    },

    backButton: {
        backgroundColor: '#161822',
        border: '1px solid #242736',
        padding: '12px 20px',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '600',
        color: '#94a3b8',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },

    pageTitleHeader: {
        fontSize: '24px',
        fontWeight: '800',
        color: '#ffb300',
        letterSpacing: '1px',
        textTransform: 'uppercase'
    },

    metaHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#161822',
        padding: '20px 30px',
        borderRadius: '10px',
        color: '#ffffff',
        fontSize: '16px',
        marginBottom: '32px',
        border: '1px solid #242736',
        width: '100%',
        boxSizing: 'border-box'
    },

    metaBadge: {
        fontWeight: '600',
        color: '#cbd5e1'
    },

    downloadLink: {
        color: '#ffb300',
        textDecoration: 'none',
        fontWeight: '600',
        fontSize: '16px'
    },

    paneContainer: {
        display: 'grid',
        gridTemplateColumns: '70fr 30fr',
        gap: '30px',
        alignItems: 'stretch',
        width: '100%',
        boxSizing: 'border-box'
    },


    // Left Summary Pane Structure
    summaryPane: {
        backgroundColor: '#161822',
        borderRadius: '12px',
        padding: '40px',
        border: '1px solid #242736',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        boxSizing: 'border-box',
        height: 'fit-content'
    },

    paneHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        borderBottom: '1px solid #242736',
        paddingBottom: '18px'
    },

    paneTitle: {
        margin: 0,
        fontSize: '22px',
        color: '#ffffff',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },

    copyButton: {
        padding: '10px 18px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        border: '1px solid',
        transition: 'all 0.2s ease'
    },

    markdownContent: {
        color: '#cbd5e1',
        fontSize: '18px',
        lineHeight: '1.8'
    },


    // Right Companion Pane Structure
    chatPane: {
        backgroundColor: '#161822',
        borderRadius: '12px',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        height: '650px',
        border: '1px solid #242736',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        boxSizing: 'border-box',
        position: 'sticky',
        top: '24px',
        alignSelf: 'start'
    },

    chatTitle: {
        margin: '0 0 20px 0',
        fontSize: '18px',
        color: '#ffffff',
        fontWeight: '700',
        textTransform: 'uppercase',
        borderBottom: '1px solid #242736',
        paddingBottom: '14px',
        letterSpacing: '0.5px'
    },

    chatMessageWindow: {
        flex: 1,
        overflowY: 'auto',
        paddingRight: '5px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '20px'
    },

    messageRow: {
        display: 'flex',
        width: '100%'
    },

    messageBubble: {
        padding: '14px 18px',
        maxWidth: '85%',
        fontSize: '16px',
        lineHeight: '1.6',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    },

    chatSystemNotice: {
        color: '#94a3b8',
        fontSize: '15px',
        fontStyle: 'italic',
        paddingLeft: '5px'
    },

    chatInputForm: {
        display: 'flex',
        gap: '12px',
        width: '100%'
    },

    chatInputField: {
        flex: 1,
        backgroundColor: '#0d0e12',
        border: '1px solid #242736',
        borderRadius: '8px',
        padding: '14px 18px',
        fontSize: '16px',
        color: '#ffffff',
        outline: 'none',
        transition: 'border-color 0.2s ease'
    },

    chatSendButton: {
        backgroundColor: '#ffb300',
        color: '#0d0e12',
        border: 'none',
        borderRadius: '8px',
        padding: '0 24px',
        fontWeight: '700',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
    }
};