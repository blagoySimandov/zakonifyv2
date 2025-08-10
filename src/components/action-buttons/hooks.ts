interface UseActionButtonsProps {
  onViewProfile?: () => void;
  onBookConsultation?: () => void;
}

export function useActionButtons({
  onViewProfile,
  onBookConsultation,
}: UseActionButtonsProps = {}) {
  const handleViewProfile = () => {
    onViewProfile?.();
  };

  const handleBookConsultation = () => {
    onBookConsultation?.();
  };

  return {
    handleViewProfile,
    handleBookConsultation,
  };
}