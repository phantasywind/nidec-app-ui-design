CardGallery shows peer record cards in the primary area. CardGalleryItem is the flat card inside a module; ActionableCardGalleryItem is a card that is a single whole target.

A card with one destination is one link (navigation) or one button (command) over the whole card, with no inner link or button. Nested cards inside a bordered module stay flat: no second border and no shadow. A standalone card may carry its own boundary only when no surrounding module does. Do not use it as the one-column rail selector; use CollectionList.

The consumer provides the records, destinations and commands. Table and Card views of the same collection expose the same destinations and commands.
