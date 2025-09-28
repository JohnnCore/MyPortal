import { useNavigate, useLocation, useParams } from "react-router";
import Modal from "../../common/Modal/Modal";
import { BOARD } from "../../../routes/paths";

const IssueDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Check if we came from a background state (clicked from board)
  // or if we accessed directly via URL
  const hasBackground = location.state?.background;
  console.log(hasBackground);

  const handleClose = () => {
    if (hasBackground) {
      // We came from the board, so go back
      navigate(-1);
    } else {
      // We came directly via URL, navigate to the board
      navigate(BOARD);
    }
  };

  return (
    <>
      <Modal isOpen={true} onClose={handleClose} title="test">
        <h1>{id}</h1>
        <button onClick={handleClose}>Exit</button>
      </Modal>
    </>
  );
};

export default IssueDetail;
