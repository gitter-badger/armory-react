// @flow

import ContentCard from 'common/components/ContentCard';
import Card from 'common/components/Card';
import { Link } from 'react-router';
import styles from './styles.less';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

function buildUrl (item, aliasOverride, resource) {
  switch (resource) {
    case 'users':
      return `/${item.name}`;

    case 'characters':
      return `/${aliasOverride || item.alias || item.userAlias}/c/${item.name}`;

    case 'guilds':
      return `/g/${item.name}`;

    default:
      return '';
  }
}

type ContentCardListProps = {
  items: [],
  alias: string,
  resource: string,
  noBorder: bool,
  type: 'grid' | 'list',
  bottomBorder: bool,
};

const ContentCardList = ({
  items = [],
  alias,
  type = 'list',
  bottomBorder,
  noBorder,
  resource = 'characters',
}: ContentCardListProps) => {
  const content = items.length ?
    items.map((item, index) => (
      <Link
        to={buildUrl(item, alias, resource)}
        key={`${item.name}-${index}`}
        className={cx('item', 'withHover')}
      >
        <ContentCard type={item.resource} content={item} />
      </Link>)
    ) :
    [0, 0].map((data, index) => (
      <ContentCard className={styles.item} key={index} />)
    );

  const borderStyle = bottomBorder ? 'borderContainerBottom' : 'borderContainerTop';

  return (
    <div className={styles.root}>
      {!noBorder && (
        <div className={cx('borderContainer', borderStyle)}>
          <div className={cx('border', 'borderLeft')}></div>
          <div className={cx('border', 'borderRight')}></div>
        </div>
      )}

      <Card className={cx('container', type)}>
        {content}
      </Card>
    </div>
  );
};

export default ContentCardList;
