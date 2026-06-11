import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'ContentCore AI';
export const size = {
  width: 200,
  height: 200,
};
export const contentType = 'image/png';

// Image generation
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 100,
          background: 'linear-gradient(to bottom right, #8B5CF6, #6D28D9)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 900,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ marginBottom: '-10px' }}>C</div>
      </div>
    ),
    {
      ...size,
    }
  );
}
