import AuthModal from "@/components/AuthModal";

export default async function AuthPage({searchParams}:{searchParams:Promise<{mode?:string}>}){const{mode}=await searchParams;return <main className="auth-page"><aside className="auth-note"><span className="eyebrow">ANLATI TOPLULUĞU</span><p><b>Adamın da anlatacakları var.</b><br/>Kadınların da sözü var.</p></aside><AuthModal key={mode} embedded initialMode={mode==="login"?"login":"register"}/></main>}
