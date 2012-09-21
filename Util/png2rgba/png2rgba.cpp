/*
 *  Copyright 2010-2011 Fabric Technologies Inc. All rights reserved.
 */
 
#include <stdio.h>
#include <png.h>
#include <stdint.h>
#include <alloca.h>

class DataBuffer
{
public:

  DataBuffer( char const *filename )
  {
    m_fp = fopen( filename, "r" );
  }

  ~DataBuffer()
  {
    fclose( m_fp );
  }
  
  void read( void *dst, unsigned count )
  {
    fread( dst, 1, count, m_fp );
  }
  
  static void Read( png_structp png_ptr, png_bytep dst, png_size_t count )
  {
    static_cast<DataBuffer *>( png_get_io_ptr( png_ptr ) )->read( dst, count );
  }
  
private:

  FILE *m_fp;
};

static size_t counter;

void preOutput()
{
  counter = 0;
}

void pngOutput( uint8_t ch )
{
  if ( counter > 0 )
    printf( ", " );
  if ( counter++ % 16 == 0 )
    printf( "\n" );
  printf( "0x%02X", (unsigned)ch );
}

void postOutput()
{
  printf( "\n" );
}

void decode( char const *inFile )
{
  DataBuffer dataBuffer( inFile );

  png_structp png_ptr = png_create_read_struct( PNG_LIBPNG_VER_STRING, NULL, NULL, NULL );

  png_infop info_ptr = png_create_info_struct(png_ptr);

  setjmp( png_jmpbuf(png_ptr) );

  png_set_read_fn( png_ptr, &dataBuffer, &DataBuffer::Read );
  
  png_read_info( png_ptr, info_ptr );

  png_uint_32 width = 0;
  png_uint_32 height = 0;
  int bitDepth = 0;
  int colorType = -1;
  png_uint_32 retval = png_get_IHDR(
    png_ptr, info_ptr,
    &width, &height, &bitDepth, &colorType,
    NULL, NULL, NULL
    );
  
  const png_uint_32 bytesPerRow = png_get_rowbytes( png_ptr, info_ptr );
  uint8_t *rowData = (uint8_t *)alloca( bytesPerRow );

  size_t index = 0;
  for ( png_uint_32 rowIdx = 0; rowIdx < height; ++rowIdx )
  {
    png_read_row( png_ptr, (png_bytep)rowData, NULL );

    png_uint_32 byteIndex = 0;
    for ( png_uint_32 colIdx = 0; colIdx < width; ++colIdx )
    {
      if ( colorType == PNG_COLOR_TYPE_RGB || colorType == PNG_COLOR_TYPE_RGB_ALPHA )
      {
        pngOutput( rowData[byteIndex++] );
        pngOutput( rowData[byteIndex++] );
        pngOutput( rowData[byteIndex++] );
      }
      if ( colorType == PNG_COLOR_TYPE_RGB_ALPHA )
        pngOutput( rowData[byteIndex++] );
    }
  }

  png_destroy_read_struct( &png_ptr, &info_ptr, NULL );
}

int main( int argc, char **argv )
{
  for ( int i=1; i<argc; ++i )
  {
    preOutput();
    decode( argv[i] );
    postOutput();
  }
  return 0;
}
