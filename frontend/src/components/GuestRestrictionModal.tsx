import './GuestRestrictionModal.css';

interface GuestRestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuestRestrictionModal = ({ isOpen, onClose }: GuestRestrictionModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>İşlem Yetkisi Yok</h2>
        <p>
          Guest kullanıcıları sadece içerikleri görüntüleyebilir. 
          Ekleme, düzenleme veya silme işlemleri yapamazsınız.
        </p>
        <p className="modal-note">
          Bu işlemleri gerçekleştirmek için lütfen User veya Admin rolüyle giriş yapın.
        </p>
        <button className="modal-button" onClick={onClose}>
          Tamam
        </button>
      </div>
    </div>
  );
};

