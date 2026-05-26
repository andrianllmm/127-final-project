import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/shared/components/ui/input-group';
import { HugeiconsIcon } from '@hugeicons/react';
import { SearchIcon, CancelIcon } from '@hugeicons/core-free-icons';
import { useStore } from '@/features/stores/hooks/use-store';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const storeId = location.pathname.startsWith('/stores/')
    ? location.pathname.split('/stores/')[1]?.split('/')[0]
    : undefined;

  const { data: store } = useStore(storeId ?? '');

  const onSearch = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const keyword = String(formData.get('keyword') ?? '').trim();

    const params = new URLSearchParams();

    if (keyword) params.set('q', keyword);

    const pathname = storeId ? `/stores/${storeId}/items` : '/items';

    navigate({
      pathname,
      search: params.toString() ? `?${params.toString()}` : '',
    });
  };

  const defaultValue = location.pathname === '/items' ? (searchParams.get('q') ?? '') : '';

  const clearStore = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('storeId');

    navigate({
      pathname: '/items',
      search: params.toString() ? `?${params.toString()}` : '',
    });
  };

  return (
    <form onSubmit={onSearch} className="ml-auto flex w-full max-w-md px-4">
      <InputGroup>
        <InputGroupInput
          name="keyword"
          defaultValue={defaultValue}
          placeholder="Search"
          aria-label="Search"
        />

        {store && (
          <InputGroupAddon align="inline-start">
            <Badge className="flex items-center gap-1 px-2 py-1 text-xs">
              <span className="truncate max-w-30">{store.store_name}</span>

              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={clearStore}
                aria-label="Remove store filter"
              >
                <HugeiconsIcon icon={CancelIcon} />
              </Button>
            </Badge>
          </InputGroupAddon>
        )}

        <InputGroupAddon align="inline-end">
          <InputGroupButton type="submit" size="icon-xs">
            <HugeiconsIcon icon={SearchIcon} strokeWidth={2} />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
