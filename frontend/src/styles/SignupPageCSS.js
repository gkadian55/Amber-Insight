const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column', // Changed to column to handle back button stacking cleanly
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0d0e12',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    backNavContainer: {
        width: '100%',
        maxWidth: '440px', // Matches your card's width for absolute structural symmetry
        display: 'flex',
        justifyContent: 'flex-start',
        marginBottom: '14px',
        padding: '0 4px',
        boxSizing: 'border-box'
    },
    inlineBackButton: {
        background: 'none',
        border: 'none',
        color: '#94a3b8',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        padding: '6px 0',
        transition: 'color 0.2s ease',
    },
    card: {
        width: '100%',
        maxWidth: '440px',
        padding: '44px',
        backgroundColor: '#161822',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        textAlign: 'center',
        border: '1px solid #242736',
        boxSizing: 'border-box'
    },
    brand: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#ffb300',
        letterSpacing: '2px',
        margin: '0 0 10px 0',
    },
    subtitle: {
        fontSize: '16px',
        color: '#94a3b8',
        margin: '0 0 34px 0',
        fontWeight: '400',
    },
    form: {
        textAlign: 'left',
    },
    inputGroup: {
        marginBottom: '22px',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        color: '#94a3b8',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    input: {
        width: '100%',
        padding: '14px 18px',
        backgroundColor: '#0d0e12',
        border: '1px solid #242736',
        borderRadius: '6px',
        color: '#ffffff',
        fontSize: '17px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s ease',
    },
    button: {
        width: '100%',
        padding: '16px',
        backgroundColor: '#ffb300',
        border: 'none',
        borderRadius: '6px',
        color: '#0d0e12',
        fontSize: '18px',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '12px',
        transition: 'opacity 0.2s ease',
    },
    errorBox: {
        padding: '14px',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid #ef4444',
        borderRadius: '6px',
        color: '#ef4444',
        fontSize: '16px',
        marginBottom: '22px',
        textAlign: 'left',
    },
    footerText: {
        color: '#94a3b8',
        fontSize: '16px',
        marginTop: '26px',
        marginBottom: '0',
    },
    link: {
        color: '#ffb300',
        textDecoration: 'none',
        fontWeight: '600',
    }
};

export { styles };