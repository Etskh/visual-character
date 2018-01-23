import { Button } from '../../components/Core';
import BarButton from '../../components/BarButton';

export default function ExperienceBar(current, next) {
  return <div className="btn-group" role="group" aria-label="Experience controls" style={{
    width: '100%',
  }}><BarButton
      colour='orange'
      current={current}
      total={next}
    />
  </div>;
}
