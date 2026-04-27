import styles from '../scss/AccountPage.module.scss'
import {useState, useEffect} from 'react'
import Button from './Button'
import { useNavigate } from 'react-router-dom';
import {
  getPostHistory,
  updatePostHistoryEntry,
  deletePostHistoryEntry,
  type PostHistoryEntry
} from './postHistory'

function AccountPage() {
    const [themeMode, setThemeMode] = useState<string>(localStorage.getItem("theme") || "dark");
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);;
    const navigate = useNavigate();
    const api_url = import.meta.env.VITE_API_URL;
    
    const [history, setHistory] = useState<PostHistoryEntry[]>([])
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editContent, setEditContent] = useState('')

    const loadHistory = () => setHistory(getPostHistory());

    useEffect(() => {
        loadHistory();
    }, []);

    const handleEdit = (item: PostHistoryEntry) => {
        setExpandedId(item.id)
        setEditingId(item.id)
        setEditContent(item.content)
    };

    const handleSaveEdit = () => {
        if (!editingId || !editContent.trim()) return

        const item = history.find((h) => h.id === editingId)
        if (!item) return

        updatePostHistoryEntry(editingId, {
        prompt: item.prompt,
        content: editContent,
        })

        setEditingId(null)
        setEditContent('')
        loadHistory()
    }


    const handleDelete = (id: string) => {
        deletePostHistoryEntry(id)

        if (expandedId === id) setExpandedId(null)
        if (editingId === id) {
            setEditingId(null)
            setEditContent('')
        }

        loadHistory()
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${api_url}/Account/me`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });

                if(response.ok) {
                    const data = await response.json();
                    setUserData(data);
                }
                else if(response.status === 401) {
                    console.warn("Uzytkownik niezalogowany - przekierowanie");
                    navigate('/');
                }
            } catch(err) {
                console.error("Blad polaczenia z API ", err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleThemeChange = () => {
        const nextTheme = themeMode === "dark" ? 'light' : 'dark';
        setThemeMode(nextTheme);
        localStorage.setItem("theme", nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
    }

    if(loading) return <div className={styles.container}>Loading...</div>

    const data = userData || {
        userName: "Guest",
        email: "unknown@user.com",
        publishedPosts: 0,
        generatedPosts: 0
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.accountLayout}>
                    <h1 className={styles.accountTitle}>My Account</h1>

                    <div className={styles.profileCard}>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoBox}>
                                <span className={styles.label}>Name</span>
                                <p className={styles.value}>{data.userName}</p>
                            </div>
                            <div className={styles.infoBox}>
                                <span className={styles.label}>Email Address</span>
                                <p className={styles.value}>{data.email}</p>
                            </div>
                        </div>

                        <div className={styles.statsGrid}>
                            <div className={styles.statBox}>
                                <span className={styles.label}>Published</span>
                                <span className={styles.bigNumber}>{data.publishedPosts}</span>
                            </div>
                            <div className={styles.statBox}>
                                <span className={styles.label}>Generated</span>
                                <span className={styles.bigNumber}>{data.generatedPosts}</span>
                            </div>
                        </div>

                        <hr className={styles.divider} />

                        <div className={styles.settingsRow}>
                            <div className={styles.settingsInfo}>
                                <span className={styles.settingName}>Interface Theme</span>
                                <p className={styles.settingsDesc}>
                                    {themeMode === "dark" ? 'Dark mode is currently active' : 'Light mode is currently active'}
                                </p>
                            </div>

                            <div className={`${styles.switchTrack} ${themeMode === "dark" ? styles.switchOn : ''}`} onClick={() => handleThemeChange()}>
                                <div className={styles.switchThumb} />
                            </div>
                        </div>


                        <div className={styles.historySection}>
                            <div className={styles.historyHeader}>
                                <div>
                                <h2 className={styles.historyTitle}>Historia postów</h2>
                                <p className={styles.historySubtitle}>
                                    Kliknij wpis, aby go rozwinąć. Edycja pokazuje się tylko po wybraniu posta.
                                </p>
                                </div>
                            </div>

                            <div className={styles.historyScroll}>
                                {history.length === 0 ? (
                                <div className={styles.historyEmpty}>Brak zapisanych postów.</div>
                                ) : (
                                history.map((item) => {
                                    const isOpen = expandedId === item.id
                                    const isEditing = editingId === item.id

                                    return (
                                    <div key={item.id} className={styles.historyItem}>
                                        <button
                                        type="button"
                                        className={styles.historyItemHeader}
                                        onClick={() => setExpandedId(isOpen ? null : item.id)}
                                        >
                                        <div className={styles.historyItemTop}>
                                            <strong className={styles.historyItemTitle}>
                                            {item.prompt || '(bez promptu)'}
                                            </strong>
                                            <small className={styles.historyItemDate}>
                                            {new Date(item.createdAt).toLocaleString()}
                                            </small>
                                        </div>
                                        <span className={styles.historyChevron} aria-hidden="true">
                                            {isOpen ? '▾' : '▸'}
                                        </span>
                                        </button>

                                        {isOpen && (
                                        <div className={styles.historyItemBody}>
                                            {isEditing ? (
                                            <div className={styles.editPanel}>
                                                <textarea
                                                className={styles.historyTextarea}
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                />
                                                <div className={styles.historyItemActions}>
                                                <button className={styles.primaryAction} onClick={handleSaveEdit}>
                                                    Zapisz zmiany
                                                </button>
                                                <button
                                                    className={styles.secondaryAction}
                                                    onClick={() => {
                                                    setEditingId(null)
                                                    setEditContent('')
                                                    }}
                                                >
                                                    Anuluj
                                                </button>
                                                </div>
                                            </div>
                                            ) : (
                                            <>
                                                <p className={styles.historyItemContent}>{item.content}</p>
                                                <div className={styles.historyItemActions}>
                                                <button className={styles.itemButton} onClick={() => handleEdit(item)}>
                                                    Edytuj
                                                </button>
                                                <button className={styles.itemButtonDanger} onClick={() => handleDelete(item.id)}>
                                                    Usuń
                                                </button>
                                                </div>
                                            </>
                                            )}
                                        </div>
                                        )}
                                    </div>
                                    )
                                })
                                )}
                            </div>
                        </div>

                        <Button usage="navbar" text="Back to Home" onBtnClick={() => navigate("/")}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountPage;