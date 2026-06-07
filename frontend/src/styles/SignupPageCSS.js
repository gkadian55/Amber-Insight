const styles = {

    /* ─── Glow orbs ─── */
    glowOrbLeft: {
        top: '15%',
        left: '15%',
        width: '400px',
        height: '400px',
        backgroundColor: 'rgba(255, 107, 0, 0.08)'
    },

    glowOrbRight: {
        bottom: '15%',
        right: '15%',
        width: '300px',
        height: '300px',
        backgroundColor: 'rgba(255, 218, 171, 0.1)'
    },

    /* ─── Back button ─── */
    backBtn: {
        backgroundColor: 'white',
        color: 'inherit',
        padding: '8px 0px',
        margin: '-8px 0px 14px 0px',
        display: 'flex',
        justifyContent: 'left',
        fontSize: '14px',
        fontWeight: 800,
        border: 'none'
    },

    /* ─── Brand logo ─── */
    brandIconBox: {
        width: '28px',
        height: '28px',
        background: 'linear-gradient(135deg, #ff9e22 0%, #ff5c00 100%)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    brandText: {
        fontSize: '28px',
        fontWeight: '800',
        fontFamily: 'var(--font-display)',
        color: 'var(--color-text-dark)',
        letterSpacing: '-0.3px'
    }
};

export { styles };