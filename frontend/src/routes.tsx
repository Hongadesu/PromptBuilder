import { useEffect, useState } from 'react';
import { Navigate, useRoutes } from 'react-router';
import { Root } from '@/pages/Root';
import { Home } from '@/pages/Home';
import { PromptTestPage } from '@/pages/PromptTestPage';
import { QuickfillTestPage } from '@/pages/QuickfillTestPage';
import { PromptPage } from '@/pages/PromptPage';
import { PromptDetailPage } from '@/pages/PromptDetailPage';
import { QuickfillPage } from '@/pages/QuickfillPage';
import { QuickfillDetailPage } from '@/pages/QuickfillDetailPage';
import { GroupPage } from '@/pages/GroupPage';
import { GroupDetailPage } from '@/pages/GroupDetailPage';
import { GroupCreatePage } from '@/pages/GroupCreatePage';
import { Setting } from '@/pages/Setting';
import { useGlobalStore } from '@/stores';

export function AppRoutes() {
  const [loading, setLoading] = useState(true);
  const initAppStates = useGlobalStore.getState().init;

  useEffect(() => {
    const fetchInitialRoute = async () => {
      setLoading(true);
      await initAppStates();
      setLoading(false);
    };

    fetchInitialRoute();
  }, []);

  const routes = useRoutes([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          index: true,
          // element: <Navigate to='/template/test' replace />,
          element: <Navigate to='/home' replace />,
        },
        {
          path: 'home',
          element: <Home />,
        },
        {
          path: 'setting',
          element: <Setting />,
        },
        {
          path: 'test/default',
          element: <PromptTestPage />,
        },
        {
          path: 'test/quickfill',
          element: <QuickfillTestPage />,
        },
        {
          path: 'prompt',
          element: <PromptPage />,
        },
        {
          path: 'prompt/:promptId',
          element: <PromptDetailPage />,
        },
        {
          path: 'group',
          element: <GroupPage />,
        },
        {
          path: 'group/create',
          element: <GroupCreatePage />,
        },
        {
          path: 'group/:groupId',
          element: <GroupDetailPage />,
        },
        {
          path: 'quickfill',
          element: <QuickfillPage />,
        },
        {
          path: 'quickfill/:promptId',
          element: <QuickfillDetailPage />,
        },
      ],
    },
  ]);

  if (loading) {
    return <></>;
  }

  return routes;
}
