import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#F05A28',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '7px',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: 22,
            fontWeight: 800,
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            lineHeight: 1,
            marginTop: '2px',
          }}
        >
          A
        </span>
      </div>
    ),
    { ...size },
  );
}
