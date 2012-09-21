
// Image texture.
uniform sampler2D u_rgbaImage;

// Width of Image.
uniform int u_width;
// Height of Image.
uniform int u_height;
// Indicating cartoon effect is enabled or not.
uniform float u_colorMix;

void main()
{
	float fWidth = float(u_width);
	float fHeight = float(u_height);
    // X directional search matrix.
    mat3 GX = mat3( -1.0, 0.0, 1.0,
                    -2.0, 0.0, 2.0,
                    -1.0, 0.0, 1.0 );
    // Y directional search matrix.
    mat3 GY =  mat3( 1.0,  2.0,  1.0,
                     0.0,  0.0,  0.0,
                    -1.0, -2.0, -1.0 );

    vec4  fSumX = vec4( 0.0,0.0,0.0,0.0 );
    vec4  fSumY = vec4( 0.0,0.0,0.0,0.0 );
    vec4 fTotalSum = vec4( 0.0,0.0,0.0,0.0 );

    // Findout X , Y index of incoming pixel
    // from its texture coordinate.
    float fXIndex = gl_TexCoord[0].s * fWidth;
    float fYIndex = gl_TexCoord[0].t * fHeight;

    /* image boundaries Top, Bottom, Left, Right pixels*/
    if( ! ( fYIndex < 1.0 || fYIndex > fHeight - 1.0 || 
            fXIndex < 1.0 || fXIndex > fWidth - 1.0 ))
    {
        // X Directional Gradient calculation.
        for(float I=-1.0; I<=1.0; I = I + 1.0)
        {
            for(float J=-1.0; J<=1.0; J = J + 1.0)
            {
                float fTempX = ( fXIndex + I + 0.5 ) / fWidth ;
                float fTempY = ( fYIndex + J + 0.5 ) / fHeight ;
                vec4 fTempSumX = texture2D( u_rgbaImage, vec2( fTempX, fTempY ));
                fSumX = fSumX + ( fTempSumX * vec4( GX[int(I+1.0)][int(J+1.0)],
                                                    GX[int(I+1.0)][int(J+1.0)],
                                                    GX[int(I+1.0)][int(J+1.0)],
                                                    GX[int(I+1.0)][int(J+1.0)]));
            }
        }

        { // Y Directional Gradient calculation.
            for(float I=-1.0; I<=1.0; I = I + 1.0)
            {
                for(float J=-1.0; J<=1.0; J = J + 1.0)
                {
                    float fTempX = ( fXIndex + I + 0.5 ) / fWidth ;
                    float fTempY = ( fYIndex + J + 0.5 ) / fHeight ;
                    vec4 fTempSumY = texture2D( u_rgbaImage, vec2( fTempX, fTempY ));
                    fSumY = fSumY + ( fTempSumY * vec4( GY[int(I+1.0)][int(J+1.0)],
                                                        GY[int(I+1.0)][int(J+1.0)],
                                                        GY[int(I+1.0)][int(J+1.0)],
                                                        GY[int(I+1.0)][int(J+1.0)]));
                }
            }
            // Combine X Directional and Y Directional Gradient.
            vec4 fTem = fSumX * fSumX + fSumY * fSumY;
            fTotalSum = sqrt( fTem );
        }
    }
    // Checking status of cartoon effect.
    if( u_colorMix > 0.5)
    {
        // Creating cartoon effect by combining
        // edge informatioon and original image data.
        vec2 texcoord = vec2(gl_TexCoord[0]);
        vec4 col = texture2D(u_rgbaImage, texcoord);
        float edge = length(fTotalSum);
        
        fTotalSum.rgb = mix( col.xyz, vec3(0.0,0.0,0.0), edge);
        fTotalSum.a = col.a + edge;
    }
    else
    {
        // Creating displayable edge data.
        float edge = length(fTotalSum);
        fTotalSum.xyz = vec3(1.0,1.0,1.0) - edge;
        fTotalSum.a = fTotalSum.a + edge;
    }
    gl_FragColor = ( fTotalSum );
}

