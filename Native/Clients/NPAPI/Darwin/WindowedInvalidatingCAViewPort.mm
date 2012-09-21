/*
 *  Copyright 2010-2011 Fabric Technologies Inc. All rights reserved.
 */

#include <Fabric/Clients/NPAPI/Darwin/WindowedInvalidatingCAViewPort.h>
#include <Fabric/Clients/NPAPI/Interface.h>
#include <Fabric/Core/DG/Event.h>
#include <Fabric/Core/MT/LogCollector.h>
#include <Fabric/Core/Util/Mutex.h>

namespace Fabric
{
  namespace NPAPI
  {
    RC::Handle<ViewPort> WindowedInvalidatingCAViewPort::Create( RC::ConstHandle<Interface> const &interface )
    {
      NPP npp = interface->getNPP();
      
      NPBool supportsEventModel;
      if ( NPN_GetValue( npp, NPNVsupportsCocoaBool, &supportsEventModel ) != NPERR_NO_ERROR )
        supportsEventModel = false;
      if ( !supportsEventModel || NPN_SetValue( npp, NPPVpluginEventModel, (void *)NPEventModelCocoa ) != NPERR_NO_ERROR )
        return 0;
        
      NPBool supportsDrawingModel;
      if ( NPN_GetValue( npp, NPNVsupportsInvalidatingCoreAnimationBool, &supportsDrawingModel ) != NPERR_NO_ERROR )
        supportsDrawingModel = false;
      if ( !supportsDrawingModel || NPN_SetValue( npp, NPPVpluginDrawingModel, (void *)NPDrawingModelInvalidatingCoreAnimation ) != NPERR_NO_ERROR )
        return 0;
      
      FABRIC_LOG( "Using InvalidatingCoreAnimation drawing model" );
        
      return new WindowedInvalidatingCAViewPort( interface );
    }
    
    WindowedInvalidatingCAViewPort::WindowedInvalidatingCAViewPort( RC::ConstHandle<Interface> const &interface )
      : WindowedCAViewPort( interface )
      , m_npp( interface->getNPP() )
    {
    }
    
    void WindowedInvalidatingCAViewPort::redrawFinished()
    {
      //sendInvalidateMessage();
      WindowedCAViewPort::redrawFinished();
    }
    
    void WindowedInvalidatingCAViewPort::asyncRedrawFinished()
    {
      sendInvalidateMessage();
      WindowedCAViewPort::asyncRedrawFinished();
    }
    
    void WindowedInvalidatingCAViewPort::sendInvalidateMessage()
    {
      size_t width, height;
      getWindowSize( width, height );
      
      NPRect invalidRect;
      invalidRect.left = 0;
      invalidRect.top = 0;
      invalidRect.right = width;
      invalidRect.bottom = height;
      NPN_InvalidateRect( m_npp, &invalidRect );
    }
  };
};
