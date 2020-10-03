import React, {useCallback, useEffect} from 'react';
import {ContainerBottomButton} from '../../components/Container/ContainerBottomButton';
import {simpleDialogEvent} from '../../components/DialogManager/recievers';
import {TEMPLATE_EMPTY_TRASH} from '../../components/DialogManager/templates';
import {Placeholder} from '../../components/ListPlaceholders';
import SimpleList from '../../components/SimpleList';
import {NotebookItemWrapper} from '../../components/SimpleList/NotebookItemWrapper';
import {NoteItemWrapper} from '../../components/SimpleList/NoteItemWrapper';
import {useTracked} from '../../provider';
import {ACTIONS} from '../../provider/actions';

export const Trash = ({route, navigation}) => {
  const [state, dispatch] = useTracked();
  const {trash} = state;

  const onFocus = useCallback(() => {
    dispatch({
      type: ACTIONS.HEADER_STATE,
      state: {
        type: 'trash',
        menu: true,
        canGoBack: false,
        color: null,
      },
    });
    dispatch({
      type: ACTIONS.HEADER_VERTICAL_MENU,
      state: false,
    });

    dispatch({
      type: ACTIONS.HEADER_TEXT_STATE,
      state: {
        heading: 'Trash',
      },
    });

    dispatch({
      type: ACTIONS.TRASH,
    });

    dispatch({
      type: ACTIONS.CURRENT_SCREEN,
      screen: 'trash',
    });
  }, []);

  useEffect(() => {
    navigation.addListener('focus', onFocus);
    return () => {
      navigation.removeListener('focus', onFocus);
    };
  });

  useEffect(() => {
    if (navigation.isFocused()) {
      dispatch({
        type: ACTIONS.SEARCH_STATE,
        state: {
          placeholder: 'Search all trash',
          data: trash,
          noSearch: false,
          type: 'trash',
          color: null,
        },
      });
    }
  }, [trash]);

  const _onPressBottomButton = () => simpleDialogEvent(TEMPLATE_EMPTY_TRASH);

  return (
    <>
      <SimpleList
        data={trash}
        type="trash"
        focused={() => navigation.isFocused()}
        RenderItem={RenderItem}
        placeholder={<Placeholder type="trash" />}
        placeholderText="Deleted notes & notebooks appear here."
      />

      <ContainerBottomButton
        title="Clear all trash"
        onPress={_onPressBottomButton}
      />
    </>
  );
};

export default Trash;

const RenderItem = ({item, index}) => {
  return item.type === 'note' ? (
    <NoteItemWrapper item={item} index={index} isTrash={true} />
  ) : (
    <NotebookItemWrapper item={item} index={index} isTrash={true} />
  );
};
