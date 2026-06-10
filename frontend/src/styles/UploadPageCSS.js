const styles = {

    /* ─── Root wrapper ─── */
    pageWrapper: {
        position: 'relative',
        overflowX: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
    },

    glowOrbTop: {
        top: '-10%',
        right: '-10%',
        width: '500px',
        height: '500px',
        backgroundColor: 'rgba(255, 107, 0, 0.12)'
    },

    glowOrbBottom: {
        bottom: '10%',
        left: '-5%',
        width: '400px',
        height: '400px',
        backgroundColor: 'rgba(255, 218, 171, 0.15)'
    },

    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 64px',
        position: 'relative',
        zIndex: 10,
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto'
    },

    logoLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer'
    },

    logoIconBox: {
        width: '36px',
        height: '36px',
        background: 'linear-gradient(135deg, #ff9e22 0%, #ff5c00 100%)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(255, 92, 0, 0.25)'
    },

    logoText: {
        fontSize: '32px',
        fontWeight: '800',
        fontFamily: 'var(--font-display)',
        color: 'var(--color-text-dark)',
        letterSpacing: '-0.5px'
    },

    navAuthRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },

    navDashboardBtn: {
        padding: '8px 18px',
        fontSize: '14px'
    },

    navLogoutBtn: {
        padding: '8px 18px',
        fontSize: '14px',
        borderColor: '#ef4444',
        color: '#ef4444'
    },

    navSignInBtn: {
        padding: '10px 24px',
        fontSize: '15px'
    },

    mainHero: {
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        alignItems: 'center',
        gap: '40px',
        padding: '40px 64px 80px',
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto',
        position: 'relative',
        zIndex: 5
    },

    mockupDeck: {
        position: 'relative',
        height: '480px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },

    mockupGlow: {
        position: 'absolute',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,165,0,0.18) 0%, rgba(255,255,255,0) 70%)',
        zIndex: 0
    },

    floatCard: {
        position: 'absolute',
        padding: '18px',
        borderRadius: '14px',
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-md)',
        width: '250px'
    },

    floatCard1: {
        top: '30px',
        left: '90px',
        zIndex: 2,
        transform: 'rotate(-4deg)'
    },

    floatCard2: {
        top: '135px',
        left: '65px',
        zIndex: 3,
        transform: 'rotate(2deg)'
    },

    floatCard3: {
        top: '245px',
        left: '90px',
        zIndex: 4,
        transform: 'rotate(-2deg)'
    },

    floatCardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '12px'
    },

    floatCardLines: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },

    fileIconPdf: {
        backgroundColor: 'rgba(225, 29, 72, 0.1)',
        color: 'var(--color-pdf)',
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold'
    },

    fileIconDocx: {
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        color: 'var(--color-docx)',
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold'
    },

    fileIconPptx: {
        backgroundColor: 'rgba(234, 88, 12, 0.1)',
        color: 'var(--color-pptx)',
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold'
    },

    floatCardFileName: {
        fontSize: '13.5px',
        fontWeight: '700',
        color: 'var(--color-text-dark)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '150px'
    },

    floatCardFileMeta: {
        fontSize: '10px',
        color: 'var(--color-text-muted)'
    },

    linePdf1: { height: '6px', backgroundColor: '#f3ece3', width: '100%', borderRadius: '2px' },
    linePdf2: { height: '6px', backgroundColor: '#f3ece3', width: '90%', borderRadius: '2px' },
    linePdf3: { height: '6px', backgroundColor: '#f3ece3', width: '60%', borderRadius: '2px' },

    lineDocx1: { height: '6px', backgroundColor: '#e2f0fd', width: '100%', borderRadius: '2px' },
    lineDocx2: { height: '6px', backgroundColor: '#e2f0fd', width: '85%', borderRadius: '2px' },

    pptxChartRow: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
    },

    pptxDonut: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'conic-gradient(#ff6b00 0% 60%, #cc5200 60% 85%, #f5f0f6 85% 100%)',
        flexShrink: 0
    },

    pptxLinesWrap: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },

    linePptx1: { height: '6px', backgroundColor: '#fbece1', width: '100%', borderRadius: '2px' },
    linePptx2: { height: '6px', backgroundColor: '#fbece1', width: '60%', borderRadius: '2px' },

    summaryCard: {
        position: 'absolute',
        top: '30px',
        right: '125px',
        width: '260px',
        padding: '20px',
        borderRadius: '18px',
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 5
    },

    summaryCardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '14px'
    },

    summaryCardTitle: {
        fontSize: '15px',
        fontWeight: '700',
        color: 'var(--color-text-dark)'
    },

    summaryLines: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '18px'
    },

    summaryLineHighlight: { height: '7px', backgroundColor: '#fffae9', borderLeft: '3px solid #ffb300', width: '100%' },
    summaryLine1: { height: '7px', backgroundColor: '#f8f9fa', width: '90%' },
    summaryLine2: { height: '7px', backgroundColor: '#f8f9fa', width: '95%' },
    summaryLine3: { height: '7px', backgroundColor: '#f8f9fa', width: '70%' },

    summaryTagsRow: {
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap'
    },

    tagKeyTakeaways: {
        fontSize: '10px',
        padding: '4px 10px',
        borderRadius: '99px',
        backgroundColor: '#fff6eb',
        color: '#e67300',
        fontWeight: '600'
    },

    tagRisks: {
        fontSize: '10px',
        padding: '4px 10px',
        borderRadius: '99px',
        backgroundColor: '#fef2f2',
        color: '#ef4444',
        fontWeight: '600'
    },

    tagOpportunities: {
        fontSize: '10px',
        padding: '4px 10px',
        borderRadius: '99px',
        backgroundColor: '#fff7ed',
        color: '#ea580c',
        fontWeight: '600'
    },

    chatCard: {
        position: 'absolute',
        bottom: '15px',
        right: '75px',
        width: '300px',
        padding: '18px',
        borderRadius: '18px',
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-premium)',
        zIndex: 6
    },

    chatUserTurn: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '12px',
        alignItems: 'flex-start',
        gap: '8px'
    },

    chatUserBubble: {
        backgroundColor: 'var(--color-text-purple)',
        color: '#ffffff',
        fontSize: '11.5px',
        padding: '10px 14px',
        borderRadius: '14px 14px 2px 14px',
        maxWidth: '80%',
        lineHeight: '1.4',
        textAlign: 'left'
    },

    chatAvatar: {
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        backgroundColor: '#eae6ee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        flexShrink: 0
    },

    chatAiTurn: {
        display: 'flex',
        gap: '8px',
        marginBottom: '14px',
        alignItems: 'flex-start'
    },

    chatAiAvatar: {
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-bg-cit-orange)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        flexShrink: 0
    },

    chatAiBubble: {
        backgroundColor: '#faf9f6',
        border: '1px solid #f2ece3',
        fontSize: '11.5px',
        padding: '10px 14px',
        borderRadius: '2px 14px 14px 14px',
        color: 'var(--color-text-dark)',
        lineHeight: '1.4',
        textAlign: 'left'
    },

    chatCitations: {
        display: 'flex',
        gap: '6px',
        marginTop: '8px'
    },

    chatCitation: {
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        fontSize: '9px',
        padding: '3px 8px',
        border: '1px solid #f0e9e1',
        borderRadius: '4px',
        backgroundColor: '#ffffff'
    },

    chatInput: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid var(--color-border)',
        borderRadius: '99px',
        padding: '8px 16px',
        backgroundColor: '#faf9f6'
    },

    chatInputPlaceholder: {
        fontSize: '11px',
        color: '#a39b98'
    },

    chatInputSend: {
        fontSize: '11px',
        color: 'var(--amber-orange)'
    },

    heroTextCol: {
        paddingLeft: '20px'
    },

    greetingText: {
        fontSize: '26px',
        fontWeight: '700',
        fontFamily: 'var(--font-display)',
        color: 'var(--color-text-dark)',
        margin: '0 0 10px 0',
        letterSpacing: '-0.3px'
    },

    greetingNameGradient: {
        background: 'linear-gradient(90deg, #ff8c00 0%, #ff3c00 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },

    heroH1: {
        fontSize: '60px',
        fontWeight: '800',
        fontFamily: 'var(--font-display)',
        color: 'var(--color-text-dark)',
        lineHeight: '1.1',
        margin: '0 0 24px 0',
        letterSpacing: '-1.5px'
    },

    heroH1Gradient: {
        background: 'linear-gradient(90deg, #ff8c00 0%, #ff3c00 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },

    heroSubtitle: {
        color: 'var(--color-text-muted)',
        fontSize: '18px',
        lineHeight: '1.6',
        margin: '0 0 40px 0',
        maxWidth: '480px'
    },

    uploadZoneWrapper: {
        display: 'inline-block',
        position: 'relative',
        width: '100%',
        maxWidth: '420px',
        cursor: 'pointer'
    },

    fileInputHidden: {
        display: 'none'
    },

    fireIconSpan: {
        fontSize: '20px'
    },

    checkmarksRow: {
        display: 'flex',
        gap: '24px',
        marginTop: '28px',
        color: 'var(--color-text-muted)',
        fontSize: '13px',
        fontWeight: '500'
    },

    checkItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },

    checkTick: {
        color: 'var(--amber-orange)',
        fontWeight: 'bold'
    },

    featuresSection: {
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto',
        padding: '40px 64px 60px',
        position: 'relative',
        zIndex: 5
    },

    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px'
    },

    featureCard: {
        padding: '32px'
    },

    featureIcon: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: '#fff6eb',
        color: 'var(--amber-orange)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(255, 107, 0, 0.08)'
    },

    featureTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: 'var(--color-text-dark)',
        margin: '0 0 10px 0'
    },

    featureDesc: {
        fontSize: '14px',
        color: 'var(--color-text-muted)',
        lineHeight: '1.6',
        margin: '0 0 16px 0'
    },

    footer: {
        textAlign: 'center',
        padding: '24px',
        borderTop: '1px solid var(--color-border)',
        color: 'var(--color-text-muted)',
        fontSize: '12px',
        marginTop: 'auto',
        position: 'relative',
        zIndex: 5,
        backgroundColor: '#ffffff'
    },

    footerInner: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px'
    },

    loadingOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 252, 248, 0.92)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px'
    },

    loadingSpinnerWrap: {
        position: 'relative',
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    loadingRing: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        border: '4px solid var(--color-border)',
        borderTopColor: 'var(--amber-orange)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },

    loadingTextWrap: {
        textAlign: 'center'
    },

    loadingTitle: {
        fontSize: '20px',
        fontWeight: '700',
        color: 'var(--color-text-dark)',
        margin: '0 0 8px 0',
        fontFamily: 'var(--font-display)'
    },

    loadingSubtitle: {
        fontSize: '14px',
        color: 'var(--color-text-muted)',
        margin: 0
    },

    sidebarBackdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.15)',
        backdropFilter: 'blur(3px)',
        zIndex: 999
    },

    savedSidebarPanel: {
        position: 'fixed',
        top: 0,
        right: 0,
        width: '380px',
        height: '100vh',
        backgroundColor: 'rgba(255, 252, 248, 0.95)',
        backdropFilter: 'blur(16px)',
        borderLeft: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-premium)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 24px',
        transition: 'all 0.3s ease-in-out'
    },

    savedSidebarHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
    },

    savedSidebarTitle: {
        fontSize: '18px',
        fontWeight: '800',
        color: 'var(--color-text-dark)',
        fontFamily: 'var(--font-display)'
    },

    savedSidebarClose: {
        background: 'transparent',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        color: 'var(--color-text-muted)'
    },

    savedSidebarList: {
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },

    savedSidebarEmpty: {
        color: 'var(--color-text-muted)',
        fontSize: '14px',
        textAlign: 'center',
        marginTop: '40px'
    },

    savedDocCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-border)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left'
    },

    savedDocIconBase: {
        color: '#ffffff',
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: '900',
        flexShrink: 0
    },

    savedDocInfo: {
        flex: 1,
        minWidth: 0
    },

    savedDocName: {
        fontSize: '13px',
        fontWeight: '700',
        color: 'var(--color-text-dark)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },

    savedDocDate: {
        fontSize: '11px',
        color: 'var(--color-text-muted)',
        marginTop: '2px'
    }
};

export const getUploadBtnStyle = (dragActive) => ({
    width: '100%',
    padding: '16px 28px',
    fontSize: '17px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    border: dragActive ? '2px dashed var(--amber-dark)' : 'none',
    backgroundColor: dragActive ? 'var(--amber-dark)' : undefined
});

export { styles };