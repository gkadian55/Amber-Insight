const styles = {

    loadingScreen: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fffcf8',
        flexDirection: 'column',
        gap: '16px'
    },

    loadingSpinner: {
        width: '48px',
        height: '48px',
        border: '4px solid #f0e9e1',
        borderTopColor: 'var(--amber-orange)',
        borderRadius: '50%',
        animation: 'pulseGlow 1.5s infinite'
    },

    loadingText: {
        fontSize: '15px',
        color: 'var(--color-text-muted)',
        fontWeight: '600'
    },

    logoIconBox: {
        width: '28px',
        height: '28px',
        background: 'linear-gradient(135deg, #ff9e22 0%, #ff5c00 100%)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    logoText: {
        fontSize: '24px',
        fontWeight: '800',
        fontFamily: 'var(--font-display)',
        color: 'var(--color-text-dark)',
        letterSpacing: '-0.3px'
    },

    emptyStateBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '24px 8px',
        textAlign: 'center'
    },

    emptyStateIcon: {
        fontSize: '28px'
    },

    emptyStateTitle: {
        fontSize: '12px',
        fontWeight: '600',
        color: 'var(--color-text-dark)'
    },

    emptyStateSub: {
        fontSize: '11px',
        color: 'var(--color-text-muted)'
    },

    noMatchText: {
        fontSize: '12px',
        color: 'var(--color-text-muted)',
        padding: '12px 8px'
    },

    docIconBase: {
        color: '#ffffff',
        width: '26px',
        height: '26px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '9px',
        fontWeight: '900',
        flexShrink: 0
    },

    docInfoFlex: {
        flex: 1,
        minWidth: 0
    },

    uploadFooterWrapper: {
        marginTop: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },

    fileInputHidden: {
        display: 'none'
    },

    uploadBtn: {
        padding: '12px',
        fontSize: '13px',
        width: '100%',
        borderRadius: '10px'
    },

    userProfileRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },

    userAvatarBox: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #ff9e22 0%, #ff5c00 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '800',
        color: '#fff',
        flexShrink: 0
    },

    userName: {
        fontSize: '16px',
        fontWeight: '700',
        color: 'var(--color-text-dark)'
    },

    breadcrumb: {
        fontSize: '16px'
    },

    copyBtn: {
        padding: '8px 16px',
        fontSize: '13px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s'
    },

    markdownContent: {
        lineHeight: '1.75',
        color: 'var(--color-text-dark)',
        fontSize: '16px'
    },

    chatHeaderTitle: {
        fontSize: '18px'
    },

    chatHeaderStatusRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    },

    chatStatusDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#22c55e'
    },

    chatStatusText: {
        fontSize: '11px',
        color: 'var(--color-text-muted)',
        fontWeight: '600'
    },

    chatAiAvatarStyle: {
        backgroundColor: 'var(--color-bg-cit-orange)'
    },

    chatUserAvatarStyle: {
        backgroundColor: 'var(--color-bg-purple)',
        marginLeft: '4px'
    },

    chatLoadingRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        color: 'var(--color-text-muted)'
    },

    chatLoadingDot: {
        width: '6px',
        height: '6px',
        backgroundColor: 'var(--amber-orange)',
        borderRadius: '50%',
        animation: 'pulseFire 1s infinite'
    }
};

export const getDocIconStyle = (bg) => ({
    ...styles.docIconBase,
    backgroundColor: bg
});

export { styles };