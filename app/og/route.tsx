import { ImageResponse } from 'next/og';
export const runtime = 'edge';

export async function GET(request: Request){
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'InGeeks Technologies';
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%', width: '100%', display: 'flex', flexDirection:'column', justifyContent:'center', padding:'60px',
          background: 'linear-gradient(135deg,#0d1422,#132032,#0d1422)', fontFamily:'system-ui', position:'relative'
        }}
      >
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 30% 25%, rgba(86,96,255,0.35), transparent 60%)' }} />
        <div style={{ fontSize: 62, fontWeight:700, background:'linear-gradient(90deg,#ffffff,#9ca3af)', WebkitBackgroundClip:'text', color:'transparent', lineHeight:1.1 }}>{title}</div>
        <div style={{ marginTop:24, fontSize:26, color:'#9ca3af', fontWeight:500 }}>Innovating Ideas. Building Futures.</div>
        <div style={{ marginTop:40, display:'flex', gap:16 }}>
          {["AI","Web","Mobile","Cloud"].map(tag=> (
            <div key={tag} style={{ fontSize:20, fontWeight:600, padding:'8px 18px', borderRadius:999, background:'rgba(255,255,255,0.08)', color:'#fff', backdropFilter:'blur(4px)', border:'1px solid rgba(255,255,255,0.15)' }}>{tag}</div>
          ))}
        </div>
      </div>
    ),
    { width:1200, height:630 }
  );
}
